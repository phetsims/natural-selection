// Copyright 2020, University of Colorado Boulder

/**
 * Shrub is the model of a shrub, the food for bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Sprite from './Sprite.js';

class Shrub extends Sprite {

  /**
   * @param {HTMLImageElement} tenderImage - image used when the shrub is tender
   * @param {HTMLImageElement} toughImage - image used when the shrub is tough
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Property.<boolean>} isToughProperty
   * @param {Object} [options]
   */
  constructor( tenderImage, toughImage, modelViewTransform, isToughProperty, options ) {

    assert && assert( tenderImage instanceof HTMLImageElement, 'invalid tenderImage' );
    assert && assert( toughImage instanceof HTMLImageElement, 'invalid toughImage' );
    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );
    assert && assert( isToughProperty instanceof Property, 'invalid isToughProperty' );
    assert && assert( typeof isToughProperty.value === 'boolean', 'invalid isToughProperty.value' );

    options = merge( {}, options );

    super( modelViewTransform, options );

    // @public (read-only)
    this.tenderImage = tenderImage;
    this.toughImage = toughImage;
    this.isToughProperty = isToughProperty;

    // @public whether the shrub is visible, used to hide shrubs when the food supply is limited
    this.visibleProperty = new BooleanProperty( true );
  }

  /**
   * @public
   */
  reset() {
    assert && assert( false, 'Shrub does not support reset' );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'Shrub does not support dispose' );
  }
}

naturalSelection.register( 'Shrub', Shrub );
export default Shrub;