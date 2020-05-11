// Copyright 2020, University of Colorado Boulder

/**
 * ShrubNode display on shrub, which can toggled between 'tender' and 'tough'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import naturalSelection from '../../naturalSelection.js';
import Shrub from '../model/Shrub.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import OriginNode from './OriginNode.js';
import SpriteNode from './SpriteNode.js';

// constants
const IMAGE_SCALE = 0.5; // how much the shrub PNG images are scaled
const TANDEM_NAME_FONT = new PhetFont( 12 );

class ShrubNode extends SpriteNode {

  /**
   * @param {Shrub} shrub
   * @param {Object} [options]
   */
  constructor( shrub, options ) {

    assert && assert( shrub instanceof Shrub, 'invalid shrub' );

    options = merge( {}, options );

    const toughShrubNode = new Image( shrub.toughImage, {
      scale: IMAGE_SCALE,
      centerX: 0,
      bottom: 0
    } );

    const tenderShrubNode = new Image( shrub.tenderImage, {
      scale: IMAGE_SCALE,
      centerX: toughShrubNode.centerX,
      bottom: toughShrubNode.bottom
    } );

    assert && assert( !options.children, 'ShrubNode sets children' );
    options.children = [ toughShrubNode, tenderShrubNode ];

    // Red dot at the origin
    if ( NaturalSelectionConstants.SHOW_ORIGIN ) {
      options.children.push( new OriginNode() );
    }

    // Show the tandem name centered below the shrub
    if ( NaturalSelectionConstants.SHOW_INFO ) {
      options.children.push( new Text( shrub.tandem.name, {
        font: TANDEM_NAME_FONT,
        fill: 'black',
        centerX: toughShrubNode.centerX,
        top: toughShrubNode.bottom + 5
      } ) );
    }

    super( shrub, options );

    // Show/hide shrub
    shrub.visibleProperty.link( visible => {
      this.visible = visible;
    } );

    // Set the appearance of the shrub to tender or tough.
    shrub.isToughProperty.link( isTough => {
      toughShrubNode.visible = isTough;
      tenderShrubNode.visible = !isTough;
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'ShrubNode does not support dispose' );
  }
}

naturalSelection.register( 'ShrubNode', ShrubNode );
export default ShrubNode;