import * as utils from '../utils'
import { UserAgent } from '../utils'
import { unlockAndRedirectToDocument } from './utils'
import {
  SSI_UNLOCKED_DOC_VIEWER_TEST_ID,
  MORE_OPTIONS_TEST_ID,
  TOGGLE_ANSWERS_TEST_ID,
  QUESTION_PANEL_CONTAINER_TEST_ID,
  DOWNLOAD_SSI_TEST_ID,
  TEST_DB_FILENAME,
  NAVIGATION_TEST_ID,
  NAVIGATION_INPUT_TEST_ID,
  SSI_ROTATE_TEST_ID_RIGHT,
  SSI_VIEWPORT_ROTATION_TEST_ID,
  SSI_ROTATE_TEST_ID_LEFT,
  SSI_ROTATE_TEST_ID,
  RotateOption,
  SSI_PRINT_TEST_ID,
  SSI_ZOOM_TEST_ID,
  SSI_FULL_SCREEN_TEST_ID,
  SSI_SEARCH_TEST_ID,
  SSI_SIDEBAR_TOGGLE_TEST_ID,
  SSI_ZOOM_IN_TEST_ID,
  SSI_ZOOM_OUT_TEST_ID,
  ZoomOption,
  SSI_ZOOM_SELECTOR_TEST_ID,
  PointerDirection,
  SSI_SEARCH_INPUT_TEST_ID,
  SSI_SEARCH_INPUT_CLEAR_TEST_ID,
  SSI_SEARCH_INPUT_INCREMENT_TEST_ID,
  SSI_SEARCH_INPUT_DECREMENT_TEST_ID,
  SSI_THUMBNAIL_TEST_ID,
  SSI_UNLOCKED_DOC_HEADER_TEST_ID,
  SSI_UNLOCKED_SIDEBAR_TEST_ID,
  SSI_SEARCH_RESULT_TOTAL_TEST_ID,
} from './constants'

describe('Unlocked Document Desktop', () => {
  context('Unlocked Viewer Desktop', () => {
    it('renders SSI doc viewer with content', () => {
      unlockAndRedirectToDocument()
      cy.get('#html-prev-1')
    })
  })

  context('Ask a Tutor Button Redesign', () => {
    beforeEach(() => {
      cy.visit(`/shortcuts/user/basic-and-unlock-doc/9449927`, {
        headers: {
          'ch-use-document-paper-chat': '0',
          'ch-force-bucket-doc-exp-unlocked-document-paper-chat': '0',
        },
      })
      cy.viewport(1441, 1800) // makes the screen tall enough to see all available components
    })
    it('should opens Ask Expert Tutors Workflow when "ask a tutor" button is clicked', () => {
      cy.findByRole('button', { name: 'Ask your question' }).click({ force: true })
      cy.get('.modal-content').should('be.visible')
      cy.findByLabelText('Close modal').should('be.visible')
    })
  })

  context.skip('Viewer Toolbar Desktop', () => {
    /**
     * we need to make sure we have a larger viewport becuase some
     * icons dont show by design
     */
    beforeEach(() => {
      cy.viewport(1118, 1494)
    })

    it('Turns off answer injection', () => {
      unlockAndRedirectToDocument()

      cy.findByTestId(TOGGLE_ANSWERS_TEST_ID).click()
      cy.findAllByTestId(QUESTION_PANEL_CONTAINER_TEST_ID).should('not.exist')
    })

    context('Toolbar shows the proper options for desktop', () => {
      it('toggle, search, navigation, zoom, download, full screen, toggle, more options', () => {
        unlockAndRedirectToDocument()

        cy.findByTestId(SSI_SIDEBAR_TOGGLE_TEST_ID).should('exist')
        cy.findByTestId(SSI_SEARCH_TEST_ID).should('exist')
        cy.findByTestId(NAVIGATION_TEST_ID).should('exist')
        cy.findByTestId(
          `${SSI_ZOOM_SELECTOR_TEST_ID}-${ZoomOption.FIT_TO_WIDTH}`,
        ).should('exist')
        cy.findByTestId(DOWNLOAD_SSI_TEST_ID).should('exist')
        cy.findByTestId(SSI_FULL_SCREEN_TEST_ID).should('exist')
        cy.findByTestId(MORE_OPTIONS_TEST_ID).should('exist')
      })
    })

    context('Sidebar Navigation ', () => {
      it('Finds sidebar navigation, clicks on thumbnail and navigates to appropriate page', () => {
        unlockAndRedirectToDocument()

        cy.findByTestId(SSI_SIDEBAR_TOGGLE_TEST_ID).click()
        cy.findByTestId(`${SSI_THUMBNAIL_TEST_ID}-3`).click()
        cy.get('#html-prev-3').should('be.visible')
        cy.findByTestId(`${SSI_THUMBNAIL_TEST_ID}-6`).click()
        cy.get('#html-prev-6').should('be.visible')
      })
    })

    /**
     * With the mark js libarary the search element is wrapped with a
     * data-markjs attribute so we query for the found items using that attibute
     */
    context('Search ', () => {
      it('Searches the document and DOESNT find text', () => {
        unlockAndRedirectToDocument()

        cy.findByTestId(SSI_SEARCH_TEST_ID).should('be.visible')
        cy.findByTestId(SSI_SEARCH_INPUT_TEST_ID).type(
          'itwasthebestoftimesitwastheworstofteimes',
        )
        cy.get('[data-markjs="true"]').should('have.length', 0)
        cy.findByTestId(SSI_SEARCH_INPUT_CLEAR_TEST_ID).should('be.visible')
      })

      it('Searches the document and finds text', () => {
        unlockAndRedirectToDocument()

        cy.findByTestId(SSI_SEARCH_TEST_ID).should('be.visible')
        cy.findByTestId(SSI_SEARCH_INPUT_TEST_ID).type('the{enter}')
        cy.get(`[data-testid=SSI_SEARCH_RESULT_TOTAL_TEST_ID]`).then(
          ($span) => {
            cy.get('[data-markjs="true"]').should('have.length', 3)
          },
        )
      })

      it('Searches the document, finds text and clears it', () => {
        unlockAndRedirectToDocument()

        cy.findByTestId(SSI_SEARCH_TEST_ID).should('be.visible')
        cy.findByTestId(SSI_SEARCH_INPUT_TEST_ID).type(
          'itwasthebestoftimesitwastheworstofteimes',
        )
        cy.get('[data-markjs="true"]').should('have.length', 0)
        cy.findByTestId(SSI_SEARCH_INPUT_CLEAR_TEST_ID).click()
        cy.get(`[data-testid=SSI_SEARCH_INPUT_TEST_ID]`).then(($e) => {
          const searchResult = $e.text()
          expect(searchResult).eq('')
        })
      })

      it('Searches the document, finds text and navigates by clicking down arrow to 3rd item', () => {
        unlockAndRedirectToDocument()
        cy.findByTestId(SSI_SEARCH_TEST_ID).should('be.visible')
        cy.findByTestId(SSI_SEARCH_INPUT_TEST_ID).type('the')

        cy.get(`[data-testid=${SSI_SEARCH_INPUT_INCREMENT_TEST_ID}]`).as(
          'increment',
        )
        cy.get('@increment').should('be.visible')
        cy.findByTestId(SSI_SEARCH_INPUT_DECREMENT_TEST_ID).should('be.visible')
        cy.get('@increment').click({ force: true })
        cy.get('@increment').click({ force: true })

        cy.get(`[data-testid=${SSI_SEARCH_RESULT_TOTAL_TEST_ID}]`).then(
          ($span) => {
            const currentSearchResultCount = $span.text().split('of')[0].trim()
            expect(currentSearchResultCount).eq('3')
          },
        )
      })

      it('Searches the document, finds text and navigates by clicking down arrow and back with up arrow', () => {
        unlockAndRedirectToDocument()

        cy.findByTestId(SSI_SEARCH_TEST_ID).should('be.visible')
        cy.findByTestId(SSI_SEARCH_INPUT_TEST_ID).type('the')

        cy.get(`[data-testid=${SSI_SEARCH_INPUT_INCREMENT_TEST_ID}]`).as(
          'increment',
        )
        cy.get(`[data-testid=${SSI_SEARCH_INPUT_DECREMENT_TEST_ID}]`).as(
          'decrement',
        )

        cy.get('@increment').should('be.visible')
        cy.get('@decrement').should('be.visible')

        cy.get('@increment').click({ force: true })
        cy.wait(500)
        cy.get('@increment').click({ force: true })
        cy.wait(500)
        cy.get('@increment').click({ force: true })
        cy.wait(500)
        cy.get('@decrement').click({ force: true })
        cy.wait(500)
        cy.get('@decrement').click({ force: true })
        cy.wait(500)

        cy.get(`[data-testid=${SSI_SEARCH_RESULT_TOTAL_TEST_ID}]`).then(
          ($span) => {
            const currentSearchResultCount = $span.text().trim()
            expect(currentSearchResultCount).eq('2 of 11')
          },
        )
      })
    })

    context('Page Navigation', () => {
      it('Navigates to page #4', () => {
        unlockAndRedirectToDocument()
        cy.findByTestId(NAVIGATION_TEST_ID)
        cy.findByTestId(NAVIGATION_INPUT_TEST_ID).type('{backspace}4{enter}')
        cy.get('div[data-html-viewer-page="4"]').should('be.visible')
        /**
         * Checks if the toolbar is sticky
         */
        cy.window().then(() => {
          cy.findByTestId('VIEWER_TOOL_BAR_TEST_ID').should('be.visible')
        })
      })

      it('Navigates to next page when clicking down arrow', () => {
        unlockAndRedirectToDocument()

        cy.findByTestId(NAVIGATION_TEST_ID)
        cy.findByTestId(
          `${NAVIGATION_TEST_ID}-${PointerDirection.DOWN}`,
        ).click()
        cy.get('div[data-html-viewer-page="2"]').should('be.visible')
      })

      it('Navigates to previous page when clicking up arrow', () => {
        unlockAndRedirectToDocument()

        cy.findByTestId(NAVIGATION_TEST_ID)
        cy.findByTestId(
          `${NAVIGATION_TEST_ID}-${PointerDirection.DOWN}`,
        ).click()
        cy.findByTestId(
          `${NAVIGATION_TEST_ID}-${PointerDirection.DOWN}`,
        ).click()
        cy.findByTestId(`${NAVIGATION_TEST_ID}-${PointerDirection.UP}`).click()
        cy.get('div[data-html-viewer-page="2"]').should('be.visible')
      })
    })

    context('Download', () => {
      it('Verifies download anchor url and redirect', () => {
        unlockAndRedirectToDocument()
        cy.findByTestId(DOWNLOAD_SSI_TEST_ID)
          .find('a')
          .then((elem) => {
            const redirectUrl = elem.attr('href')
            expect(redirectUrl).eq(
              `/api/v1/documents/download/${TEST_DB_FILENAME}`,
            )
            cy.findByTestId(DOWNLOAD_SSI_TEST_ID).find('a').click()
            cy.url().should(
              'eq',
              `https://dev.coursehero.com/api/v1/documents/download/${TEST_DB_FILENAME}/`,
            )
          })
      })
    })

    context('Zoom', () => {
      it('Shows ALL zoom options', () => {
        unlockAndRedirectToDocument()

        cy.get(
          `[data-testid=${SSI_ZOOM_SELECTOR_TEST_ID}-${ZoomOption.FIT_TO_WIDTH}]`,
        ).click()
        cy.findByTestId(SSI_ZOOM_IN_TEST_ID).should('exist')
        cy.findByTestId(SSI_ZOOM_OUT_TEST_ID).should('exist')
        cy.get(
          `[data-testid=${SSI_ZOOM_TEST_ID}-${ZoomOption.FIT_TO_WIDTH}]`,
        ).should('exist')
        cy.get(
          `[data-testid=${SSI_ZOOM_TEST_ID}-${ZoomOption.PERCENT_10}]`,
        ).should('exist')
        cy.get(
          `[data-testid=${SSI_ZOOM_TEST_ID}-${ZoomOption.PERCENT_25}]`,
        ).should('exist')
        cy.get(
          `[data-testid=${SSI_ZOOM_TEST_ID}-${ZoomOption.PERCENT_50}]`,
        ).should('exist')
        cy.get(
          `[data-testid=${SSI_ZOOM_TEST_ID}-${ZoomOption.PERCENT_75}]`,
        ).should('exist')
        cy.get(
          `[data-testid=${SSI_ZOOM_TEST_ID}-${ZoomOption.PERCENT_100}]`,
        ).should('exist')
        cy.get(
          `[data-testid=${SSI_ZOOM_TEST_ID}-${ZoomOption.PERCENT_150}]`,
        ).should('exist')
        cy.get(
          `[data-testid=${SSI_ZOOM_TEST_ID}-${ZoomOption.PERCENT_200}]`,
        ).should('exist')
      })

      it('fits to width', () => {
        unlockAndRedirectToDocument()
        cy.get(
          `[data-testid=${SSI_ZOOM_SELECTOR_TEST_ID}-${ZoomOption.FIT_TO_WIDTH}]`,
        ).click()
        cy.get(
          `[data-testid=${SSI_ZOOM_TEST_ID}-${ZoomOption.FIT_TO_WIDTH}]`,
        ).click()
        cy.get(
          `[data-testid=${SSI_ZOOM_SELECTOR_TEST_ID}-${ZoomOption.FIT_TO_WIDTH}]`,
        ).should('be.visible')
      })

      it('10%', () => {
        unlockAndRedirectToDocument()
        cy.get(
          `[data-testid=${SSI_ZOOM_SELECTOR_TEST_ID}-${ZoomOption.FIT_TO_WIDTH}]`,
        ).click()
        cy.get(
          `[data-testid=${SSI_ZOOM_TEST_ID}-${ZoomOption.PERCENT_10}]`,
        ).click()
        cy.get(
          `[data-testid=${SSI_ZOOM_SELECTOR_TEST_ID}-${ZoomOption.PERCENT_10}]`,
        ).should('be.visible')
      })

      it('25%', () => {
        unlockAndRedirectToDocument()
        cy.get(
          `[data-testid=${SSI_ZOOM_SELECTOR_TEST_ID}-${ZoomOption.FIT_TO_WIDTH}]`,
        ).click()
        cy.get(
          `[data-testid=${SSI_ZOOM_TEST_ID}-${ZoomOption.PERCENT_25}]`,
        ).click()
        cy.get(
          `[data-testid=${SSI_ZOOM_SELECTOR_TEST_ID}-${ZoomOption.PERCENT_25}]`,
        ).should('be.visible')
      })

      it('50%', () => {
        unlockAndRedirectToDocument()
        cy.get(
          `[data-testid=${SSI_ZOOM_SELECTOR_TEST_ID}-${ZoomOption.FIT_TO_WIDTH}]`,
        ).click()
        cy.get(
          `[data-testid=${SSI_ZOOM_TEST_ID}-${ZoomOption.PERCENT_50}]`,
        ).click()
        cy.get(
          `[data-testid=${SSI_ZOOM_SELECTOR_TEST_ID}-${ZoomOption.PERCENT_50}]`,
        ).should('be.visible')
      })

      it('75%', () => {
        unlockAndRedirectToDocument()
        cy.get(
          `[data-testid=${SSI_ZOOM_SELECTOR_TEST_ID}-${ZoomOption.FIT_TO_WIDTH}]`,
        ).click()
        cy.get(
          `[data-testid=${SSI_ZOOM_TEST_ID}-${ZoomOption.PERCENT_75}]`,
        ).click()
        cy.get(
          `[data-testid=${SSI_ZOOM_SELECTOR_TEST_ID}-${ZoomOption.PERCENT_75}]`,
        ).should('be.visible')
      })

      it('100%', () => {
        unlockAndRedirectToDocument()
        cy.get(
          `[data-testid=${SSI_ZOOM_SELECTOR_TEST_ID}-${ZoomOption.FIT_TO_WIDTH}]`,
        ).click()
        cy.get(
          `[data-testid=${SSI_ZOOM_TEST_ID}-${ZoomOption.PERCENT_100}]`,
        ).click()
        cy.get(
          `[data-testid=${SSI_ZOOM_SELECTOR_TEST_ID}-${ZoomOption.PERCENT_100}]`,
        ).should('be.visible')
      })

      it('150%', () => {
        unlockAndRedirectToDocument()
        cy.get(
          `[data-testid=${SSI_ZOOM_SELECTOR_TEST_ID}-${ZoomOption.FIT_TO_WIDTH}]`,
        ).click()
        cy.get(
          `[data-testid=${SSI_ZOOM_TEST_ID}-${ZoomOption.PERCENT_150}]`,
        ).click()
        cy.get(
          `[data-testid=${SSI_ZOOM_SELECTOR_TEST_ID}-${ZoomOption.PERCENT_150}]`,
        ).should('be.visible')
      })
      it('200%', () => {
        unlockAndRedirectToDocument()
        cy.get(
          `[data-testid=${SSI_ZOOM_SELECTOR_TEST_ID}-${ZoomOption.FIT_TO_WIDTH}]`,
        ).click()
        cy.get(
          `[data-testid=${SSI_ZOOM_TEST_ID}-${ZoomOption.PERCENT_200}]`,
        ).click()
        cy.get(
          `[data-testid=${SSI_ZOOM_SELECTOR_TEST_ID}-${ZoomOption.PERCENT_200}]`,
        ).should('be.visible')
      })
    })

    it('Shows more options, rotates left, and upside down', () => {
      unlockAndRedirectToDocument()
      cy.findByTestId(MORE_OPTIONS_TEST_ID).click()
      cy.findByTestId(SSI_ROTATE_TEST_ID).should('exist')
      cy.get(
        `[data-testid=${SSI_VIEWPORT_ROTATION_TEST_ID}-${RotateOption.NONE}]`,
      ).should('exist')
      cy.findByTestId(SSI_ROTATE_TEST_ID_LEFT).click()
      cy.get(
        `[data-testid=${SSI_VIEWPORT_ROTATION_TEST_ID}-${RotateOption.ROTATE_270}]`,
      ).should('exist')
      cy.findByTestId(SSI_ROTATE_TEST_ID_LEFT).click()
      cy.get(
        `[data-testid=${SSI_VIEWPORT_ROTATION_TEST_ID}-${RotateOption.ROTATE_180}]`,
      ).should('exist')
    })
    it('Shows more options, rotates right and upside down', () => {
      unlockAndRedirectToDocument()
      cy.findByTestId(MORE_OPTIONS_TEST_ID).click()
      cy.findByTestId(SSI_ROTATE_TEST_ID).should('exist')
      cy.get(
        `[data-testid=${SSI_VIEWPORT_ROTATION_TEST_ID}-${RotateOption.NONE}]`,
      ).should('exist')
      cy.findByTestId(SSI_ROTATE_TEST_ID_RIGHT).click()
      cy.get(
        `[data-testid=${SSI_VIEWPORT_ROTATION_TEST_ID}-${RotateOption.ROTATE_90}]`,
      ).should('exist')
      cy.findByTestId(SSI_ROTATE_TEST_ID_RIGHT).click()
      cy.get(
        `[data-testid=${SSI_VIEWPORT_ROTATION_TEST_ID}-${RotateOption.ROTATE_180}]`,
      ).should('exist')
    })
    it('Shows more options with print option', () => {
      unlockAndRedirectToDocument()
      cy.findByTestId(MORE_OPTIONS_TEST_ID).click()
      cy.findByTestId(SSI_PRINT_TEST_ID)
    })
    it('Shows more options with print option', () => {
      unlockAndRedirectToDocument()
      cy.findByTestId(MORE_OPTIONS_TEST_ID).click()
      cy.findByTestId(SSI_PRINT_TEST_ID)
    })
  })
})
