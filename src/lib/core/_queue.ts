export type SortKey = string & { __sortKey: true };

export interface AbstractQueueItem {
  readonly sortKey: SortKey;
}

const assert = (condition: boolean): void => {};

/**
 * Represents an abstract queue sorted by sortKey in the items.
 *
 * @template T - Type parameter that has to extend AbstractQueueItem for sortKey.
 * @property {ReadonlyArray<T>} items - Array containing queue items; immutable.
 */
export interface AbstractQueue<T> {
  readonly items: ReadonlyArray<T & AbstractQueueItem>;
}

/**
 * Interface representing a hint for inserting an item into a queue.
 *
 * For example, if you want to insert an item roughly at the midpoint
 * between two existing items, you can provide the sort keys of the two items
 * and 0.5.
 *
 * If you want to insert an item at the beginning of the queue, you can provide 0.
 * @interface
 *
 * @property {SortKey | undefined} [after] - The sort key after which to insert the item
 * @property {SortKey | undefined} [before] - The sort key before which to insert the item
 * @property {number} percent - The percentage position between the before and after items (0-100)
 */
export interface QueueInsertHint {
  after?: SortKey | undefined;
  before?: SortKey | undefined;
  percent: number;
}

/**
 * Represents a position in a queue.
 * It can be at an item, before an item, or at the end of the queue.
 * So in total there are 2*N+1 possible positions in a queue with N items.
 *
 * They go as follows:
 *
 * { position: 'before', index: 0 } - Before the first item
 * { position: 'at', index: 0 } - At the beginning of the queue
 * { position: 'before', index: 1 } - Between the first and second item
 * { position: 'at', index: 1 } - At the second item
 * @typedef {Object} QueuePosition
 * @property {'at' | 'before'} position - Indicates whether to place at the index or before it
 * @property {number} index - The target index in the queue
 */
type SearchLocation = {
  position: "at" | "before";
  index: number;
};

/**
 * Finds the position in a queue where a new item with the given sortKey should be inserted.
 *
 * @param queue - The queue to search in
 * @param sortKey - The sort key to find the position for
 * @returns A QueuePosition object indicating where to insert the new item:
 *          - If position is "before" and index is queue length, append to end
 *          - If position is "before", insert before the index
 *          - If position is "at", there is an existing item at that index
 *
 * @typeParam T - Type of items in the queue, must extend AbstractQueueItem
 */
export const findSortKey = <T>(
  queue: AbstractQueue<T>,
  sortKey: SortKey
): SearchLocation => {
  const index = queue.items.findIndex((item) => item.sortKey >= sortKey);
  if (index === -1) {
    return { position: "before", index: queue.items.length };
  }
  if (queue.items[index].sortKey === sortKey) {
    return { position: "at", index };
  }
  return { position: "before", index };
};

const CODE_A = "a".charCodeAt(0);
const CODE_Z = "z".charCodeAt(0);

/**
 * Creates a new sort key string that lexicographically sorts between two given sort keys.
 * Uses a binary search approach to find a midpoint string between the 'before' and 'after' keys.
 *
 * @param before - The sort key that should sort before the new key (optional)
 * @param after - The sort key that should sort after the new key (optional)
 * @returns A new sort key string that will sort between the before and after keys
 *
 * @example
 * createSortKey("b", "d") // Returns "c"
 * createSortKey(undefined, "m") // Returns something before "m"
 * createSortKey("m", undefined) // Returns something after "m"
 *
 * @remarks
 * - If before is omitted, assumes "zzzz..." as the upper bound
 * - If after is omitted, assumes "aaaa..." as the lower bound
 * - The algorithm works character by character to find a midpoint
 * - Breaks when a differentiating character is found and inserted
 */
export const createSortKey = (after: SortKey, before: SortKey): SortKey => {
  const key: string[] = [];

  for (let i = 0; ; i++) {
    const aCode = i < after.length ? after.charCodeAt(i) : CODE_A;
    const bCode = i < before.length ? before.charCodeAt(i) : CODE_Z + 1;

    if (aCode === bCode) {
      key.push(after ? after[i] : "a");
    } else {
      const mCode = Math.floor(aCode + (bCode - aCode) / 2);
      assert(mCode >= aCode && mCode < bCode);
      key.push(String.fromCharCode(mCode));
      if (mCode !== aCode) {
        break;
      }
    }
  }

  return key.join("") as SortKey;
};

/**
 * Finds an index to find a new item to the queue.
 *
 * @template T - Type extending AbstractQueueItem
 * @param queue - The queue to add the item to
 * @param item - The item to be added to the queue, sortKey will be changed
 * @param afterSortKey - Optional left key
 * @param beforeSortKey - Optional key to sort befo
 * @returns A new queue with the added item
 */
export const findInsertionPoint = <T>(
  queue: AbstractQueue<T>,
  item: T,
  hint: QueueInsertHint
): { index: number; sortKey: SortKey } => {
  assert(hint.percent >= 0 && hint.percent <= 1);

  const afterLocation = hint.after
    ? findSortKey(queue, hint.after)
    : { position: "before", index: 0 };

  const beforeLocation = hint.before
    ? findSortKey(queue, hint.before)
    : { position: "before", index: queue.items.length };

  // if at indices I - 1, I, I + 1 we have 10, 20, 30
  // then
  //  after 15 -> I + 0.25   -> I
  //  after 20 -> I + 0.75   -> I + 1
  //  after 25 -> I + 1.25   -> I + 1
  const after =
    afterLocation.position === "at"
      ? afterLocation.index + 0.75
      : afterLocation.index + 0.25;

  //  before 15 -> I - 0.25    -> I
  //  before 20 -> I + 0.25    -> I
  //  before 25 -> I + 0.75    -> I + 1
  const before =
    beforeLocation.position === "at"
      ? beforeLocation.index + 0.25
      : beforeLocation.index - 0.25;

  const hinted = after + (before - after) * hint.percent;
  const index = Math.round(hinted);

  const sortKey = createSortKey(
    index > 0 ? queue.items[index - 1].sortKey : ("" as SortKey),
    index < queue.items.length ? queue.items[index].sortKey : ("" as SortKey)
  );

  return { index, sortKey };
};

export const addToQueue = <T>(
  queue: AbstractQueue<T>,
  item: T,
  hint: QueueInsertHint
): AbstractQueue<T> => {
  const { index, sortKey } = findInsertionPoint(queue, item, hint);
  return {
    items: [
      ...queue.items.slice(0, index),
      { ...item, sortKey },
      ...queue.items.slice(index),
    ],
  };
};
