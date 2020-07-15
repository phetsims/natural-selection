// Copyright 2020, University of Colorado Boulder

//TODO #128 delete tenderImage, toughImage, isToughProperty
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
import Organism from './Organism.js';

// as specified in https://github.com/phetsims/natural-selection/issues/17
const CATEGORIES = [ 'A', 'B', 'C' ];

class Shrub extends Organism {

  /**
   * @param {string} category
   * @param {HTMLImageElement} tenderImage - image used when the shrub is tender
   * @param {HTMLImageElement} toughImage - image used when the shrub is tough
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Property.<boolean>} isToughProperty
   * @param {Object} [options]
   */
  constructor( category, tenderImage, toughImage, modelViewTransform, isToughProperty, options ) {

    assert && assert( CATEGORIES.includes( category ), 'invalid category' );
    assert && assert( tenderImage instanceof HTMLImageElement, 'invalid tenderImage' );
    assert && assert( toughImage instanceof HTMLImageElement, 'invalid toughImage' );
    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );
    assert && AssertUtils.assertPropertyOf( isToughProperty, 'boolean' );

    options = merge( {}, options );

    super( modelViewTransform, options );

    // @public (read-only)
    this.category = category;
    this.tenderImage = tenderImage;
    this.toughImage = toughImage;
    this.isToughProperty = isToughProperty;

    // @public whether the shrub is visible, used to hide shrubs when the food supply is limited
    assert && assert( !this.visibleProperty, 'attempt to redefine visibleProperty' );
    this.visibleProperty = new BooleanProperty( true );
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

naturalSelection.register( 'Shrub', Shrub );
export default Shrub;