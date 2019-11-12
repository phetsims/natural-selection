// Copyright 2019, University of Colorado Boulder

/**
 * ZoomControl is a general control for zooming in and out.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  class ZoomControl extends LayoutBox {

    /**
     * @param {Property.<number>} zoomLevelProperty
     * @param {Object} [options]
     */
    constructor( zoomLevelProperty, options ) {

      options = merge( {

        // {number} the amount to change zoomLevelProperty each time a button is pressed
        step: 1,

        // {number|null} the range of zoom, affects whether buttons are disabled. null means no range.
        zoomLevelMax: null,
        zoomLevelMin: null,

        // ZoomButton options
        zoomButtonOptions: {
          radius: 6,
          baseColor: NaturalSelectionColors.ZOOM_BUTTONS
        },

        // LayoutBox options
        spacing: 5,
        orientation: 'horizontal',
        align: 'center'

      }, options );

      assert && assert( options.zoomButtonOptions.in === undefined, 'ZoomControl sets zoomButtonOptions.in' );
      assert && assert( options.zoomButtonOptions.listener === undefined, 'ZoomControl sets zoomButtonOptions.listener' );

      const zoomInButton = new ZoomButton( merge( {
        in: true,
        listener: () => {
          zoomLevelProperty.value += options.step;
        }
      }, options.zoomButtonOptions ) );

      const zoomOutButton = new ZoomButton( merge( {
        in: false,
        listener: () => {
          zoomLevelProperty.value -= options.step;
        }
      }, options.zoomButtonOptions ) );

      const zoomLevelListener = zoomLevel => {
        phet.log && phet.log( `zoomLevel=${zoomLevel}` );
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