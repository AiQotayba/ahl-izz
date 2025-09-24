const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    // Define the order of test files
    const testOrder = [
      'setup.test.ts',
      'auth.test.ts',
      'validation.test.ts',
      'public.test.ts',
      'pledge.test.ts',
      'integration.test.ts'
    ];

    return tests.sort((a, b) => {
      const aIndex = testOrder.findIndex(name => a.path.includes(name));
      const bIndex = testOrder.findIndex(name => b.path.includes(name));
      
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      
      return aIndex - bIndex;
    });
  }
}

module.exports = CustomSequencer;
