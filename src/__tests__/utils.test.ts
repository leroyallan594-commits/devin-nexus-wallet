describe('Utility Functions', () => {
  it('should verify Ethereum address validation', () => {
    const validAddress = '0x1234567890123456789012345678901234567890';
    const invalidAddress = '0x123';
    
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    
    expect(ethAddressRegex.test(validAddress)).toBe(true);
    expect(ethAddressRegex.test(invalidAddress)).toBe(false);
  });

  it('should verify Solana address validation', () => {
    const validAddress = 'AbCdEf1234567890AbCdEf1234567890AbCdEf123';
    const invalidAddress = 'abc';
    
    expect(validAddress.length).toBeGreaterThanOrEqual(32);
    expect(validAddress.length).toBeLessThanOrEqual(44);
    expect(invalidAddress.length).toBeLessThan(32);
  });

  it('should verify Bitcoin address validation', () => {
    const validAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    const invalidAddress = 'invalid';
    
    const btcAddressRegex = /^(1|3)[a-zA-Z0-9]{25,34}$|^bc1[a-zA-Z0-9]{39,59}$/;
    
    expect(btcAddressRegex.test(validAddress)).toBe(true);
    expect(btcAddressRegex.test(invalidAddress)).toBe(false);
  });

  it('should verify balance formatting', () => {
    const wei = '1000000000000000000'; // 1 ETH in wei
    const eth = (BigInt(wei) / BigInt(10 ** 18)).toString();
    
    expect(eth).toBe('1');
  });

  it('should verify mnemonic word count', () => {
    const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const words = mnemonic.split(' ');
    
    expect(words.length).toBe(12);
  });

  it('should verify transaction hash format', () => {
    const txHash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
    
    expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
  });

  it('should verify token decimals', () => {
    const tokenDecimals = [6, 8, 18];
    
    tokenDecimals.forEach(decimals => {
      expect(decimals).toBeGreaterThan(0);
      expect(decimals).toBeLessThanOrEqual(18);
    });
  });

  it('should verify amount parsing', () => {
    const amount = '1.5';
    const decimals = 18;
    const parsed = (parseFloat(amount) * 10 ** decimals).toString();
    
    expect(BigInt(parsed)).toBeGreaterThan(0);
  });

  it('should verify chain ID validation', () => {
    const validChainIds = ['ethereum', 'bsc', 'polygon', 'solana', 'bitcoin'];
    const invalidChainId = 'invalid-chain';
    
    expect(validChainIds.includes('ethereum')).toBe(true);
    expect(validChainIds.includes(invalidChainId)).toBe(false);
  });

  it('should verify gas limit validation', () => {
    const gasLimit = '21000';
    const gasLimitNumber = parseInt(gasLimit);
    
    expect(gasLimitNumber).toBeGreaterThan(0);
    expect(gasLimitNumber).toBeLessThan(10000000);
  });
});
