import BasePage from '../base-page';
import LineItem from './line-item';

export class SelectItemsPage extends BasePage {
  lineItems: LineItem[] = [];
  lineItemSelector = 'tr.lineItemRow > td.lineItemTextCell > div';
  paymentAmountSelector = 'input[name="CartUserInput.LineItems[0].SubFields[0].Value"]';
  paymentAmount = 0;

  async parseLineItems(): Promise<void> {
    await this.page.waitForSelector(this.submitSelector);
    const lineItems = await this.page.$$eval(this.lineItemSelector, (elements) =>
      elements.map((element) => element.innerHTML.replace('\n', '').trimStart().trimEnd()),
    );
    const paymentAmount = await this.page.$eval(
      this.paymentAmountSelector,
      (element) => (element as HTMLInputElement).value,
    );

    // TODO: Support multiple line items
    const lineItem: LineItem = {
      accountNo: lineItems[0],
      serviceAddress: lineItems[1],
      name: lineItems[2],
      service: lineItems[3],
      amountOwed: parseFloat(lineItems[4]),
      paymentAmount: parseFloat(paymentAmount),
    };

    this.paymentAmount = lineItem.paymentAmount;

    this.lineItems.push(lineItem);
  }

  async submit(): Promise<void> {
    await this.page.waitForSelector(this.submitSelector);
    // TODO: Support selection of line item
    await this.page.type(this.paymentAmountSelector, this.paymentAmount.toString());
    return super.submit();
  }
}
