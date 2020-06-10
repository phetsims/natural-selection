// Copyright 2020, University of Colorado Boulder

/**
 * Shrub is the model of a shrub, the food for bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import NaturalSelectionSprite from './NaturalSelectionSprite.js';

class Shrub extends NaturalSelectionSprite {

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
    assert && AssertUtils.assertPropertyOf( isToughProperty, 'boolean' );

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