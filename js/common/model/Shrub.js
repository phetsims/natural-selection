// Copyright 2020, University of Colorado Boulder

/**
 * Shrub is the model of a shrub, the food for bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import ShrubIO from './ShrubIO.js';
import Sprite from './Sprite.js';

class Shrub extends Sprite {

  /**
   * @param {HTMLImageElement} toughImage
   * @param {HTMLImageElement} tenderImage
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Property.<boolean>} isToughProperty
   * @param {Object} [options]
   */
  constructor( toughImage, tenderImage, modelViewTransform, isToughProperty, options ) {

    assert && assert( toughImage instanceof HTMLImageElement, 'invalid toughImage' );
    assert && assert( tenderImage instanceof HTMLImageElement, 'invalid tenderImage' );
    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );
    assert && assert( isToughProperty instanceof Property, 'invalid isToughProperty' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: ShrubIO
    }, options );

    super( modelViewTransform, options );

    // @public (read-only)
    this.toughImage = toughImage;
    this.tenderImage = tenderImage;
    this.isToughProperty = isToughProperty;

    // @public whether the shrub is visible, used to hide shrubs when the food supply is limited
    this.visibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'visibleProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'whether the shrub is visible'
    } );
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