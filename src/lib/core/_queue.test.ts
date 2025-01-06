import {
  AbstractQueue,
  addToQueue,
  findSortKey,
  createSortKey,
  SortKey,
} from "./_queue";

interface TestQueueItem {
  id: number;
}

describe("Queue", () => {
  let queue: AbstractQueue<TestQueueItem>;

  beforeEach(() => {
    queue = {
      items: [
        { id: 1, sortKey: "b" as SortKey },
        { id: 2, sortKey: "d" as SortKey },
        { id: 3, sortKey: "f" as SortKey },
      ],
    };
  });

  describe("findSortKey", () => {
    let queue: AbstractQueue<TestQueueItem>;

    beforeEach(() => {
      queue = {
        items: [
          { id: 1, sortKey: "b" as SortKey },
          { id: 2, sortKey: "d" as SortKey },
          { id: 3, sortKey: "f" as SortKey },
        ],
      };
    });

    it("should find position before first item", () => {
      const result = findSortKey(queue, "a" as SortKey);
      expect(result).toEqual({ position: "before", index: 0 });
    });

    it("should find exact match at first item", () => {
      const result = findSortKey(queue, "b" as SortKey);
      expect(result).toEqual({ position: "at", index: 0 });
    });

    it("should find position between items", () => {
      const result = findSortKey(queue, "c" as SortKey);
      expect(result).toEqual({ position: "before", index: 1 });
    });

    it("should find exact match at middle item", () => {
      const result = findSortKey(queue, "d" as SortKey);
      expect(result).toEqual({ position: "at", index: 1 });
    });

    it("should find position at end of queue", () => {
      const result = findSortKey(queue, "z" as SortKey);
      expect(result).toEqual({ position: "before", index: 3 });
    });

    it("should handle empty queue", () => {
      const emptyQueue: AbstractQueue<TestQueueItem> = { items: [] };
      const result = findSortKey(emptyQueue, "a" as SortKey);
      expect(result).toEqual({ position: "before", index: 0 });
    });
  });

  describe("createSortKey", () => {
    it("should create key between two adjacent letters", () => {
      const result = createSortKey("b" as SortKey, "d" as SortKey);
      expect(result).toBe("c");
    });

    it("should create key between same letters by adding character", () => {
      const result = createSortKey("b" as SortKey, "c" as SortKey);
      expect(result).toBe("bn");
    });

    it("should handle undefined before", () => {
      const result = createSortKey("" as SortKey, "m" as SortKey);
      expect(result < "m").toBe(true);
    });

    it("should handle undefined after", () => {
      const result = createSortKey("m" as SortKey, "" as SortKey);
      expect(result > "m").toBe(true);
    });

    it("should handle matching prefixes by appending character", () => {
      const result = createSortKey("abc" as SortKey, "abd" as SortKey);
      expect(result.startsWith("abc")).toBe(true);
      expect(result > "abc" && result < "abd").toBe(true);
    });

    it("should create key between distant letters", () => {
      const result = createSortKey("a" as SortKey, "z" as SortKey);
      expect(result > "a" && result < "z").toBe(true);
    });
  });

  describe("addToQueue", () => {
    it("should add item to empty queue", () => {
      const hint = {
        before: "b" as SortKey,
        percent: 0,
      };

      const result = addToQueue<TestQueueItem>({ items: [] }, { id: 4 }, hint);
      expect(result.items).toEqual([{ id: 4, sortKey: "n" }]);
    });

    it("should add item to start of queue", () => {
      const result = addToQueue(queue, { id: 4 }, { percent: 0 });
      expect(result.items).toEqual([
        { id: 4, sortKey: "an" },
        { id: 1, sortKey: "b" },
        { id: 2, sortKey: "d" },
        { id: 3, sortKey: "f" },
      ]);
    });

    it("should add item right before the middle of queue", () => {
      const result = addToQueue(queue, { id: 4 }, { percent: 0.49 });
      expect(result.items).toEqual([
        { id: 1, sortKey: "b" },
        { id: 4, sortKey: "c" },
        { id: 2, sortKey: "d" },
        { id: 3, sortKey: "f" },
      ]);
    });

    it("should add item right after the middle of queue", () => {
      const result = addToQueue(queue, { id: 4 }, { percent: 0.51 });
      expect(result.items).toEqual([
        { id: 1, sortKey: "b" },
        { id: 2, sortKey: "d" },
        { id: 4, sortKey: "e" },
        { id: 3, sortKey: "f" },
      ]);
    });

    it("should add item before another item", () => {
      const result = addToQueue(
        queue,
        { id: 4 },
        { before: "d" as SortKey, percent: 1 }
      );
      expect(result.items).toEqual([
        { id: 1, sortKey: "b" },
        { id: 4, sortKey: "c" },
        { id: 2, sortKey: "d" },
        { id: 3, sortKey: "f" },
      ]);
    });

    it("should add item after another item", () => {
      const result = addToQueue(
        queue,
        { id: 4 },
        { after: "d" as SortKey, percent: 0 }
      );
      expect(result.items).toEqual([
        { id: 1, sortKey: "b" },
        { id: 2, sortKey: "d" },
        { id: 4, sortKey: "e" },
        { id: 3, sortKey: "f" },
      ]);
    });

    it("should add item to end of queue", () => {
      const result = addToQueue(queue, { id: 4 }, { percent: 1 });
      expect(result.items).toEqual([
        { id: 1, sortKey: "b" },
        { id: 2, sortKey: "d" },
        { id: 3, sortKey: "f" },
        { id: 4, sortKey: "p" },
      ]);
    });
  });
});
