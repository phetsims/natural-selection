// Copyright 2020, University of Colorado Boulder

/**
 * OrganismSpriteInstance is a specialization of SpriteInstance for organisms.
 * It keeps a reference to the associated organism, and updates the sprite's position and direction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import merge from '../../../../../phet-core/js/merge.js';
import Sprite from '../../../../../scenery/js/util/Sprite.js';
import SpriteInstance from '../../../../../scenery/js/util/SpriteInstance.js';
import naturalSelection from '../../../naturalSelection.js';
import Organism from '../../model/Organism.js';
import XDirection from '../../model/XDirection.js';

class OrganismSpriteInstance extends SpriteInstance {

  /**
   * @param {Organism} organism
   * @param {Sprite} sprite
   * @param {Object} [options]
   */
  constructor( organism, sprite, options ) {

    assert && assert( organism instanceof Organism, 'invalid organism' );
    assert && assert( sprite instanceof Sprite, 'invalid sprite' );

    options = merge( {
      baseScale: 1 // the base amount to scale, tuned based on the PNG file dimensions
    }, options );

    super();

    //TODO #128 it would be nice to pass these to super
    this.sprite = sprite;
    this.transformType = SpriteInstance.TransformType.TRANSLATION_AND_SCALE;

    // @public (read-only)
    this.organism = organism;

    //TODO #128 is there a more efficient way?
    //TODO #128 locations look incorrect
    // Update position and direction, must be disposed
    const multilink = new Multilink(
      [ organism.positionProperty, organism.xDirectionProperty ],
      ( position, xDirection ) => {

        // scale
        const viewScale = options.baseScale * organism.modelViewTransform.getViewScale( position.z );
        const xSign = XDirection.toSign( xDirection );
        this.matrix.setToScale( xSign * viewScale, viewScale );

        // position
        const viewPosition = organism.modelViewTransform.modelToViewPosition( position );
        this.matrix.prependTranslation( viewPosition.x, viewPosition.y );
      } );

    // @private
    this.disposeOrganismSpriteInstance = () => {
      multilink.dispose();
    };
  }

  /**
   * @public
   */
  dispose() {
    this.disposeOrganismSpriteInstance();
    super.dispose && super.dispose();
  }
}

naturalSelection.register( 'OrganismSpriteInstance', OrganismSpriteInstance );
export default OrganismSpriteInstance;