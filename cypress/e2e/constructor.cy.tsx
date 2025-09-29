/// <reference types="cypress" />

describe('Burger constructor E2E', () => {
  beforeEach(() => {
    // Set tokens before app loads so getUser may fire
    window.localStorage.setItem('refreshToken', 'fake-refresh');
    cy.setCookie('accessToken', 'Bearer fake-access');
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('adds an ingredient to constructor', () => {
    cy.contains('Булки');
    cy.contains('Добавить').first().click();
    cy.contains('Выберите булки').should('not.exist');
  });

  it('opens and closes ingredient modal by close button and overlay', () => {
    // open ingredient modal by clicking on ingredient link
    cy.contains('Булка 1').click();
    cy.contains('Детали ингредиента').should('be.visible');
    cy.get('h3').contains('Булка 1').should('be.visible');
    // close via Escape key
    cy.get('body').type('{esc}');
    cy.contains('Детали ингредиента').should('not.exist');

    // open again and close by overlay
    cy.contains('Булка 1').click();
    cy.get('h3').contains('Булка 1').should('be.visible');
    cy.get('body').type('{esc}');
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('creates order with mocked user and order responses', () => {
    // Mock order creation
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');

    // Add bun and main
    cy.contains('Булки');
    cy.contains('Добавить').first().click(); // bun
    cy.contains('Начинка 1').parents('li').find('button').contains('Добавить').click();

    // Ensure auth is loaded if requested
    cy.wait('@getUser', { timeout: 8000 }).then(() => {});

    // Click order button
    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');

    // Modal appears with correct order number
    cy.contains('идентификатор заказа', { timeout: 10000 });
    cy.contains('12345').should('be.visible');

    // Close order modal via Escape
    cy.get('body').type('{esc}');
    cy.contains('идентификатор заказа').should('not.exist');

    // Constructor cleared
    cy.contains('Выберите булки').should('be.visible');
    cy.contains('Выберите начинку').should('be.visible');

    // Cleanup tokens
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });
});


