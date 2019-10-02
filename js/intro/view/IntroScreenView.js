// Copyright 2019, University of Colorado Boulder

/**
 * IntroView is the view for the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );

  class IntroScreenView extends ScreenView {

    /**
     * @param {IntroModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super();

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          this.interruptSubtreeInput();
          model.reset();
          this.reset();
        },
        right: this.layoutBounds.maxX - NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }

    /**
     * @public
     */
    reset() {
      //TODO
    }

    /**
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {
      //TODO
    }
  }

  return naturalSelection.register( 'IntroScreenView', IntroScreenView );
} );