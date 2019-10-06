// Copyright 2019, University of Colorado Boulder

/**
 * NaturalSelectionScreenView is the base class for all ScreenViews in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AddAMateButton = require( 'NATURAL_SELECTION/common/view/AddAMateButton' );
  const ClimateRadioButtonGroup = require( 'NATURAL_SELECTION/common/view/ClimateRadioButtonGroup' );
  const LimitedFoodCheckbox = require( 'NATURAL_SELECTION/common/view/LimitedFoodCheckbox' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );

  class NaturalSelectionScreenView extends ScreenView {

    /**
     * @param {NaturalSelectionModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super( {
        tandem: tandem
      } );

      const limitedFoodCheckbox = new LimitedFoodCheckbox( model.limitFoodProperty, {
        left: this.layoutBounds.left + NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN, //TODO
        top: this.layoutBounds.top + NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN //TODO
      } );
      this.addChild( limitedFoodCheckbox );

      const climateRadioButtonGroup = new ClimateRadioButtonGroup( model.climateProperty, {
        centerX: this.layoutBounds.centerX, //TODO
        top: this.layoutBounds.top + NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN //TODO
      } );
      this.addChild( climateRadioButtonGroup );

      const addAMateButton = new AddAMateButton( {
        listener: () => {
          this.addAMateButton.visible = false;
          //TODO
        },
        centerX: this.layoutBounds.centerX, //TODO
        bottom: this.layoutBounds.centerY //TODO
      } );
      this.addChild( addAMateButton );

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

      // @private
      this.addAMateButton = addAMateButton;
    }

    /**
     * @public
     */
    reset() {
      this.addAMateButton.visible = true;
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

  return naturalSelection.register( 'NaturalSelectionScreenView', NaturalSelectionScreenView );
} );