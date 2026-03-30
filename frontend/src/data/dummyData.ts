export const MOCK_TEST_DATA = {
  1: {
    // Valid Parentheses
    testCases: [
      { id: 1, input: '"()"', expected: "true", description: "Simple pair" },
      {
        id: 2,
        input: '"()[]{}"',
        expected: "true",
        description: "Multiple types",
      },
      {
        id: 3,
        input: '"(]"',
        expected: "false",
        description: "Mismatched types",
      },
    ],
    results: {
      executionTime: "102ms",
      output: "Checking stack... \nFound match for ')'",
      testResults: [
        { id: 1, passed: true, actual: "true" },
        { id: 2, passed: true, actual: "true" },
        { id: 3, passed: false, actual: "true" }, // Mocking a failure
      ],
    },
  },
  2: {
    // Two Sum
    testCases: [
      { id: 1, input: "nums = [2,7,11,15], target = 9", expected: "[0,1]" },
      { id: 2, input: "nums = [3,2,4], target = 6", expected: "[1,2]" },
    ],
    results: {
      executionTime: "102ms",
      output: "Hashing values... Found target complement at index 1",
      testResults: [
        { id: 1, passed: true, actual: "[0,1]" },
        { id: 2, passed: true, actual: "[1,2]" },
      ],
    },
  },
  3: {
    // Linked List Cycle
    testCases: [
      { id: 1, input: "head = [3,2,0,-4], pos = 1", expected: "true" },
      { id: 2, input: "head = [1], pos = -1", expected: "false" },
    ],
    results: {
      executionTime: "102ms",
      output:
        "Initialising pointers...\nSlow: 2, Fast: 0\nSlow: 0, Fast: 2\nCycle detected.",
      testResults: [
        {
          id: 1,
          input: "head = [3,2,0,-4], pos = 1",
          expected: "true",
          actual: "true",
          passed: true,
        },
        {
          id: 2,
          input: "head = [1], pos = -1",
          expected: "false",
          actual: "false",
          passed: true,
        },
      ],
    },
  },
  4: {
    // Reverse Linked List
    testCases: [{ id: 1, input: "[1,2,3,4,5]", expected: "[5,4,3,2,1]" }],
    results: {
      executionTime: "102ms",
      output: "Swapping pointers...\nNode(1) -> null\nNode(2) -> Node(1)...",
      testResults: [
        {
          id: 1,
          input: "[1,2,3,4,5]",
          expected: "[5,4,3,2,1]",
          actual: "[5,4,3,2,1]",
          passed: true,
        },
      ],
    },
  },
  5: {
    // Max Depth Binary Tree
    testCases: [{ id: 1, input: "[3,9,20,null,null,15,7]", expected: "3" }],
    results: {
      executionTime: "102ms",
      output:
        "DFS Traversal...\nDepth 1: Found 3\nDepth 2: Found 9, 20\nDepth 3: Found 15, 7",
      testResults: [
        {
          id: 1,
          input: "[3,9,20,null,null,15,7]",
          expected: "3",
          actual: "3",
          passed: true,
        },
      ],
    },
  },
  6: {
    // Binary Search
    testCases: [
      { id: 1, input: "nums = [-1,0,3,5,9,12], target = 9", expected: "4" },
      { id: 2, input: "nums = [-1,0,3,5,9,12], target = 2", expected: "-1" },
    ],
    results: {
      executionTime: "102ms",
      output: "Searching...\nMid: 3 (val: 5)\nMid: 4 (val: 9)\nFound target.",
      testResults: [
        {
          id: 1,
          input: "target = 9",
          expected: "4",
          actual: "4",
          passed: true,
        },
        {
          id: 2,
          input: "target = 2",
          expected: "-1",
          actual: "0",
          passed: false,
        }, // Mock failure
      ],
    },
  },
  7: {
    // Valid Anagram
    testCases: [
      { id: 1, input: 's = "anagram", t = "nagaram"', expected: "true" },
      { id: 2, input: 's = "rat", t = "car"', expected: "false" },
    ],
    results: {
      executionTime: "102ms",
      output: "Character frequency map created.\nComparing counts...",
      testResults: [
        {
          id: 1,
          input: 's="anagram", t="nagaram"',
          expected: "true",
          actual: "true",
          passed: true,
        },
        {
          id: 2,
          input: 's="rat", t="car"',
          expected: "false",
          actual: "false",
          passed: true,
        },
      ],
    },
  },
  8: {
    // Best Time to Buy/Sell Stock
    testCases: [{ id: 1, input: "[7,1,5,3,6,4]", expected: "5" }],
    results: {
      executionTime: "102ms",
      output: "Scanning prices...\nBuy at 1, Sell at 6.",
      testResults: [
        {
          id: 1,
          input: "[7,1,5,3,6,4]",
          expected: "5",
          actual: "5",
          passed: true,
        },
      ],
    },
  },
  9: {
    // Contains Duplicate
    testCases: [
      { id: 1, input: "[1,2,3,1]", expected: "true" },
      { id: 2, input: "[1,2,3,4]", expected: "false" },
    ],
    results: {
      executionTime: "102ms",
      output: "Inserting into Set...\nDuplicate found: 1",
      testResults: [
        {
          id: 1,
          input: "[1,2,3,1]",
          expected: "true",
          actual: "true",
          passed: true,
        },
        {
          id: 2,
          input: "[1,2,3,4]",
          expected: "false",
          actual: "true",
          passed: false,
        }, // Mock failure
      ],
    },
  },
};
