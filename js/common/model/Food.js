// Copyright 2020, University of Colorado Boulder

/**
 * Food is the model of one item of food.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Sprite from './Sprite.js';

class Food extends Sprite {

  /**
   * @param {string} debugLabel
   * @param {HTMLImageElement} toughImage
   * @param {HTMLImageElement} tenderImage
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Property.<boolean>} isToughProperty
   * @param {Object} [options]
   */
  constructor( debugLabel, toughImage, tenderImage, modelViewTransform, isToughProperty, options ) {

    assert && assert( typeof debugLabel === 'string', 'invalid debugLabel' );
    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );
    assert && assert( toughImage instanceof HTMLImageElement, 'invalid toughImage' );
    assert && assert( tenderImage instanceof HTMLImageElement, 'invalid tenderImage' );
    assert && assert( isToughProperty instanceof Property, 'invalid isToughProperty' );

    options = options || {};
    assert && assert( !options.tandem, 'Food is not designed to be instrumented' );

    super( modelViewTransform, options );

    // @public (read-only)
    this.debugLabel = debugLabel;
    this.toughImage = toughImage;
    this.tenderImage = tenderImage;
    this.isToughProperty = isToughProperty;

    // @public whether the food is visible, used to hide food when the food supply is limited
    this.visibleProperty = new BooleanProperty( true );
  }

  /**
   * @public
   */
  reset() {
    assert && assert( false, 'Food does not support reset' );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'Food does not support dispose' );
  }
}

naturalSelection.register( 'Food', Food );
export default Food;