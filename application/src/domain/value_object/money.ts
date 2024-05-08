export class Money {
  private value: number;

  constructor(money: number) {
    this.value = money;
  }

  getValueMoney(): number {
    return this.value;
  }
}

const validate = (message: string) => {
  throw new Error(message);
};
