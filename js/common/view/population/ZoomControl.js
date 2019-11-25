// Copyright 2019, University of Colorado Boulder

/**
 * ZoomControl is a general 'modern' control for zooming in and out.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionQueryParameters = require( 'NATURAL_SELECTION/common/NaturalSelectionQueryParameters' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RectangularButtonView = require( 'SUN/buttons/RectangularButtonView' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const FONT = new PhetFont( 16 );

  class ZoomControl extends LayoutBox {

    /**
     * @param {Property.<number>} zoomLevelProperty
     * @param {Object} [options]
     */
    constructor( zoomLevelProperty, options ) {

      options = merge( {

        // {number} the amount to change zoomLevelProperty each time a button is pressed
        step: NaturalSelectionQueryParameters.zoomStep,

        // {number|null} the range of zoomLevelProperty, affects whether buttons are disabled. null means no range.
        zoomLevelMax: null,
        zoomLevelMin: null,

        // ZoomButton options
        zoomButtonOptions: {
          baseColor: NaturalSelectionColors.ZOOM_BUTTONS,
          buttonAppearanceStrategy: RectangularButtonView.FlatAppearanceStrategy,
          cornerRadius: 0,
          xMargin: 8,
          yMargin: 5
        },

        // LayoutBox options
        spacing: 0,
        orientation: 'horizontal',
        align: 'center'

      }, options );

      assert && assert( !options.zoomButtonOptions.content, 'ZoomControl sets zoomButtonOptions.content' );
      assert && assert( !options.zoomButtonOptions.listener, 'ZoomControl sets zoomButtonOptions.listener' );

      // zoom in
      const zoomInButton = new RectangularPushButton( merge( {}, options.zoomButtonOptions, {
        content: new Text( MathSymbols.PLUS, { font: FONT } ),
        listener: () => {
          zoomLevelProperty.value += options.step;
        }
      } ) );

      // zoom out
      const zoomOutButton = new RectangularPushButton( merge( {}, options.zoomButtonOptions, {
        content: new Text( MathSymbols.MINUS, { font: FONT } ),
        listener: () => {
          zoomLevelProperty.value -= options.step;
        }
      } ) );

      // disable a button if we reach the min or max
      const zoomLevelListener = zoomLevel => {
        if ( options.zoomLevelMax !== null ) {
          zoomInButton.enabled = ( zoomLevel < options.zoomLevelMax );
        }
        if ( options.zoomLevelMin !== null ) {
          zoomOutButton.enabled = ( zoomLevel > options.zoomLevelMin );
        }
      };
      zoomLevelProperty.link( zoomLevelListener );

      assert && assert( !options.children, 'ZoomControl sets children' );
      options.children = [ zoomInButton, zoomOutButton ];

      super( options );

      // @private
      this.disposeZoomControl = () => {
        zoomLevelProperty.unlink( zoomLevelListener );
      };
    }

    /**
     * @public
     */
    dispose() {
      super.dispose();
      this.disposeZoomControl();
    }
  }

  return naturalSelection.register( 'ZoomControl', ZoomControl );
} );