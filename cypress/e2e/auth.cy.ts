describe('Carbon Pilot E2E Tests', () => {
  beforeEach(() => {
    // Navigate to the base URL before each test
    cy.visit('http://localhost:4173');
  });

  it('successfully loads the landing page', () => {
    cy.get('h1').should('contain', 'Carbon Pilot');
    cy.get('.hero-cta').should('be.visible');
  });

  it('allows navigation to the login page', () => {
    cy.contains('Get Started Free').click();
    cy.url().should('include', '/login');
    cy.get('.login-card').should('be.visible');
  });

  it('prevents unauthorized access to dashboard', () => {
    cy.visit('http://localhost:4173/dashboard');
    // Should be redirected to login
    cy.url().should('include', '/login');
  });
});
