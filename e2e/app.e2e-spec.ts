import { ApolloRidesPage } from './app.po';

describe('apollo-rides App', function() {
  let page: ApolloRidesPage;

  beforeEach(() => {
    page = new ApolloRidesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
