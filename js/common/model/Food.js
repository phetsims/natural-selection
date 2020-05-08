// Copyright 2020, University of Colorado Boulder

/**
 * Food is the model of the food supply.  It controls the type and quantity of food available to the bunnies.
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

    // {Array} Description of shrubs, where each element is for the form:
    // {
    //   {HTMLImageElement} toughImage - image used for tough shrubs
    //   {HTMLImageElement} tenderImage - image used for tender shrubs
    //   {number} x - x position in model coordinates
    //   {number} z - z position in model coordinates
    // }
    //
    // A, B, C suffix for images comes from https://github.com/phetsims/natural-selection/issues/17
    const shrubsConfig = [
      { toughImage: shrubToughAImage, tenderImage: shrubTenderAImage, x: -65, z: 210 },
      { toughImage: shrubToughAImage, tenderImage: shrubTenderAImage, x: 155, z: 160 },
      { toughImage: shrubToughBImage, tenderImage: shrubTenderBImage, x: -155, z: 160 },
      { toughImage: shrubToughBImage, tenderImage: shrubTenderBImage, x: 200, z: 250 },
      { toughImage: shrubToughCImage, tenderImage: shrubTenderCImage, x: 60, z: 185 },
      { toughImage: shrubToughCImage, tenderImage: shrubTenderCImage, x: -180, z: 270 }
    ];

    // @public (read-only) individual food items
    this.shrubs = [];
    for ( let i = 0; i < shrubsConfig.length; i++ ) {
      const shrubConfig = shrubsConfig[ i ];
      this.shrubs.push( new Shrub( shrubConfig.toughImage, shrubConfig.tenderImage, modelViewTransform, this.isToughProperty, {
        position: modelViewTransform.getGroundPosition( shrubConfig.x, shrubConfig.z ),
        tandem: options.tandem.createTandem( `shrub${i}` )
      } ) );
    }

    // When food is limited, hide half of the food
    this.isLimitedProperty.link( isLimited => {
      for ( let i = 0; i < this.shrubs.length; i++ ) {
        this.shrubs[ i ].visibleProperty.value = ( i % 2 === 0 || !isLimited );
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