// Copyright 2019, University of Colorado Boulder

/**
 * ZoomControl is a general 'modern' control for zooming in and out.
 * In this sim, it's used for scaling the y axis of the Population graph.
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
  const Tandem = require( 'TANDEM/Tandem' );
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

        // RectangularPushButton options
        buttonOptions: {
          baseColor: NaturalSelectionColors.ZOOM_BUTTONS,
          buttonAppearanceStrategy: RectangularButtonView.FlatAppearanceStrategy,
          cornerRadius: 0,
          xMargin: 8,
          yMargin: 5
        },

        // LayoutBox options
        spacing: 0,
        orientation: 'horizontal',
        align: 'center',

        // phet-io
        tandem: Tandem.REQUIRED

      }, options );

      assert && assert( !options.buttonOptions.content, 'ZoomControl sets buttonOptions.content' );
      assert && assert( !options.buttonOptions.listener, 'ZoomControl sets buttonOptions.listener' );

      // zoom in
      const zoomInButton = new RectangularPushButton( merge( {}, options.buttonOptions, {
        content: new Text( MathSymbols.PLUS, { font: FONT } ),
        listener: () => {
          zoomLevelProperty.value += options.step;
        },
        tandem: options.tandem.createTandem( 'zoomInButton' )
      } ) );

      // zoom out
      const zoomOutButton = new RectangularPushButton( merge( {}, options.buttonOptions, {
        content: new Text( MathSymbols.MINUS, { font: FONT } ),
        listener: () => {
          zoomLevelProperty.value -= options.step;
        },
        tandem: options.tandem.createTandem( 'zoomOutButton' )
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