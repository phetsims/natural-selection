// Copyright 2019, University of Colorado Boulder

/**
 * EnvironmentalFactorsPanel is the panel that contains controls for environmental factors that affect
 * the fertility and mortality of bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const LimitedFoodCheckbox = require( 'NATURAL_SELECTION/common/view/LimitedFoodCheckbox' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionPanel = require( 'NATURAL_SELECTION/common/view/NaturalSelectionPanel' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const ToughFoodCheckbox = require( 'NATURAL_SELECTION/common/view/ToughFoodCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const WolvesCheckbox = require( 'NATURAL_SELECTION/common/view/WolvesCheckbox' );

  // strings
  const environmentalFactorsString = require( 'string!NATURAL_SELECTION/environmentalFactors' );

  class EnvironmentalFactorsPanel extends NaturalSelectionPanel {

    /**
     * @param {EnvironmentModel} environmentModel
     * @param {Object} [options]
     */
    constructor( environmentModel, options ) {

      options = merge( {

        // phet-io
        tandem: Tandem.required
      }, NaturalSelectionConstants.PANEL_OPTIONS, options );

      const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [

          // title
          new Text( environmentalFactorsString, {
            font: NaturalSelectionConstants.TITLE_FONT,
            maxWidth: 175, // determined empirically,
            tandem: options.tandem.createTandem( 'environmentalFactorsText' )
          } ),

          // Wolves
          new WolvesCheckbox( environmentModel.wolves.enabledProperty, {
            tandem: options.tandem.createTandem( 'wolvesCheckbox' )
          } ),

          // Tough Food
          new ToughFoodCheckbox( environmentModel.toughFood.enabledProperty, {
            tandem: options.tandem.createTandem( 'toughFoodCheckbox' )
          } ),

          // Limited Food
          new LimitedFoodCheckbox( environmentModel.limitedFood.enabledProperty, {
            tandem: options.tandem.createTandem( 'limitedFoodCheckbox' )
          } )
        ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'EnvironmentalFactorsPanel', EnvironmentalFactorsPanel );
} );