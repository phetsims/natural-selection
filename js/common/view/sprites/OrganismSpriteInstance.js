// Copyright 2020, University of Colorado Boulder

/**
 * OrganismSpriteInstance is a specialization of SpriteInstance for organisms.
 * It keeps a reference to the associated organism, and updates the sprite's position and direction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import Sprite from '../../../../../scenery/js/util/Sprite.js';
import SpriteInstance from '../../../../../scenery/js/util/SpriteInstance.js';
import naturalSelection from '../../../naturalSelection.js';
import Organism from '../../model/Organism.js';

class OrganismSpriteInstance extends SpriteInstance {

  /**
   * @param {Organism} organism
   * @param {Sprite} sprite
   */
  constructor( organism, sprite ) {
    assert && assert( organism instanceof Organism, 'invalid organism' );
    assert && assert( sprite instanceof Sprite, 'invalid sprite' );

    super();

    //TODO it would be nice to pass these to super
    this.sprite = sprite;
    this.transformType = SpriteInstance.TransformType.TRANSLATION_AND_SCALE;

    // @public (read-only)
    this.organism = organism;

    // Update position and direction, must be disposed
    const multilink = new Multilink(
      [ organism.positionProperty, organism.xDirectionProperty ],
      ( position, xDirection ) => {

        const viewPosition = organism.modelViewTransform.modelToViewPosition( position );
        // const viewScale = organism.modelViewTransform.getViewScale( position.z );
        // const xSign = XDirection.toSign( xDirection );

        this.matrix.set02( viewPosition.x );
        this.matrix.set12( viewPosition.y );
        // this.setScaleMagnitude( xSign * scale, scale );
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