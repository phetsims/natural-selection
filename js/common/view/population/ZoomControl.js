// Copyright 2019-2020, University of Colorado Boulder

/**
 * ZoomControl is a general 'modern' control for zooming in and out.
 * In this sim, it's used for scaling the y axis of the Population graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import merge from '../../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import LayoutBox from '../../../../../scenery/js/nodes/LayoutBox.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import RectangularButtonView from '../../../../../sun/js/buttons/RectangularButtonView.js';
import RectangularPushButton from '../../../../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';

// constants
const FONT = new PhetFont( 16 );

class ZoomControl extends LayoutBox {

  /**
   * @param {NumberProperty} zoomLevelProperty - smaller value means more zoomed in
   * @param {Object} [options]
   */
  constructor( zoomLevelProperty, options ) {

    assert && assert( zoomLevelProperty instanceof NumberProperty, 'invalid zoomLevelProperty' );
    assert && assert( zoomLevelProperty.range, 'missing zoomLevelProperty.range' );

    options = merge( {

      // RectangularPushButton options
      buttonOptions: {
        baseColor: NaturalSelectionColors.ZOOM_BUTTONS,
        buttonAppearanceStrategy: RectangularButtonView.FlatAppearanceStrategy,
        cornerRadius: 0,
        xMargin: 8,
        yMargin: 5,
        fireOnHold: true,
        fireOnHoldDelay: 600, // ms
        fireOnHoldInterval: 250 // ms
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
        zoomLevelProperty.value -= 1;
      },
      tandem: options.tandem.createTandem( 'zoomInButton' )
    } ) );

    // zoom out
    const zoomOutButton = new RectangularPushButton( merge( {}, options.buttonOptions, {
      content: new Text( MathSymbols.MINUS, { font: FONT } ),
      listener: () => {
        zoomLevelProperty.value += 1;
      },
      tandem: options.tandem.createTandem( 'zoomOutButton' )
    } ) );

    // disable a button if we reach the min or max
    zoomLevelProperty.link( zoomLevel => {
      zoomInButton.enabled = ( zoomLevel > zoomLevelProperty.range.min );
      zoomOutButton.enabled = ( zoomLevel < zoomLevelProperty.range.max );
    } );

    assert && assert( !options.children, 'ZoomControl sets children' );
    options.children = [ zoomInButton, zoomOutButton ];

    super( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'ZoomControl', ZoomControl );
export default ZoomControl;