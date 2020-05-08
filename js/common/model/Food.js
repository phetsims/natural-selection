// Copyright 2020, University of Colorado Boulder

/**
 * Food is the model of the food supply, a collection of Shrubs.
 * It controls the type (tender or tough) and quantity of food that is available.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import shrubTenderAImage from '../../../images/shrub-tender-A_png.js';
import shrubTenderBImage from '../../../images/shrub-tender-B_png.js';
import shrubTenderCImage from '../../../images/shrub-tender-C_png.js';
import shrubToughAImage from '../../../images/shrub-tough-A_png.js';
import shrubToughBImage from '../../../images/shrub-tough-B_png.js';
import shrubToughCImage from '../../../images/shrub-tough-C_png.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Shrub from './Shrub.js';

class Food {

  /**
   * @param {EnvironmentModelViewTransform} modelViewTransform
   * @param {Object} [options]
   */
  constructor( modelViewTransform, options ) {

    assert && assert( modelViewTransform instanceof EnvironmentModelViewTransform, 'invalid modelViewTransform' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.isToughProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isToughProperty' )
    } );

    // @public
    this.isLimitedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isLimitedProperty' )
    } );

    // {ShrubConfig[]} describes the collection of shrubs
    //
    // @typedef ShrubConfig
    // @property {HTMLImageElement} tenderImage - image used for tender shrubs
    // @property {HTMLImageElement} toughImage - image used for tough shrubs
    // @property {number} x - x position in model coordinates
    // @property {number} z - z position in model coordinates
    //
    // A, B, C labeling of images comes from https://github.com/phetsims/natural-selection/issues/17
    const shrubConfigs = [
      { tenderImage: shrubTenderAImage, toughImage: shrubToughAImage, x:  -65, z: 210 },
      { tenderImage: shrubTenderAImage, toughImage: shrubToughAImage, x:  155, z: 160 },
      { tenderImage: shrubTenderBImage, toughImage: shrubToughBImage, x: -155, z: 160 },
      { tenderImage: shrubTenderBImage, toughImage: shrubToughBImage, x:  200, z: 250 },
      { tenderImage: shrubTenderCImage, toughImage: shrubToughCImage, x:   60, z: 185 },
      { tenderImage: shrubTenderCImage, toughImage: shrubToughCImage, x: -180, z: 270 }
    ];

    // @public (read-only) {Shrub[]} the collection of Shrubs
    this.shrubs = [];
    shrubConfigs.forEach( shrubConfig => {
      this.shrubs.push( new Shrub( shrubConfig.tenderImage, shrubConfig.toughImage, modelViewTransform, this.isToughProperty, {
        position: modelViewTransform.getGroundPosition( shrubConfig.x, shrubConfig.z )
      } ) );
    } );

    // When food is limited, hide half of the food (odd-indexed Shrubs)
    assert && assert( this.shrubs.length % 2 === 0, 'an even number of Shrubs is required' );
    this.isLimitedProperty.link( isLimited => {
      for ( let i = 1; i < this.shrubs.length; i = i + 2 ) {
        this.shrubs[ i ].visibleProperty.value = !isLimited;
      }
    } );
  }

  /**
   * @public
   */
  reset() {
    this.isToughProperty.reset();
    this.isLimitedProperty.reset();
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'Food does not support dispose' );
  }
}

naturalSelection.register( 'Food', Food );
export default Food;