describe('Memory game', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5500');
  });
  it('Игра имеет поле 4 х 4, цифры невидимы', () => {
    cy.get('div').filter('.card').should('have.length', 16);
    for (let i = 0; i < 16; i++) {
      cy.get('#game')
        .find('div')
        .eq(i)
        .should('have.css', 'color', 'rgba(0, 0, 0, 0)');
    }
  });
  it('При нажатии карта остается открытой', () => {
    for (let i = 0; i < 16; i++) {
      cy.get('#game').find('div').eq(i).click().should('have.class', 'open');
    }
  });
  it('Нажать на левую верхнюю карточку, потом на следующую, если это не пара, повторять, пока не будет найдена пара', () => {
    for (let i = 1; i < 16; i++) {
      cy.get('#game').find('div').eq(i).click();
      cy.get('#game').find('div').eq(0).click();
      if (
        cy.get('#game').find('div').eq(0).should('not.have.class', 'success')
      ) {
        continue;
      } else break;
    }
  });
  it('Нажать на левую верхнюю карточку, затем на следующую. Если это пара, то повторить со следующей карточкой, пока не будет найдена не пара', () => {
    for (let i = 0; i < 8; i++) {
      cy.get('#game')
        .find('div')
        .eq(2 * i)
        .click();
      cy.get('#game')
        .find('div')
        .eq(2 * i + 1)
        .click();
      if (
        cy
          .get('#game')
          .find('div')
          .eq(2 * i)
          .should('not.have.class', 'success')
      ) {
        break;
      } else continue;
    }
  });
});
