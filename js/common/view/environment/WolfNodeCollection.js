// Copyright 2020, University of Colorado Boulder

/**
 * WolfNodeCollection is the collection of WolfNode instances, with methods for managing that collection.
 * It encapsulates WolfNodeGroup (the PhetioGroup), hiding it from the rest of the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import Wolf from '../../model/Wolf.js';
import WolfCollection from '../../model/WolfCollection.js';
import WolfNodeGroup from './WolfNodeGroup.js';

class WolfNodeCollection extends PhetioObject {

  /**
   * @param {WolfCollection} wolfCollection
   * @param {Object} [options]
   */
  constructor( wolfCollection, options ) {
    
    assert && assert( wolfCollection instanceof WolfCollection, 'invalid wolfCollection' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, options );

    super( options );

    // @private the PhetioGroup that manages WolfNode instances as dynamic PhET-iO elements
    this.wolfNodeGroup = new WolfNodeGroup( wolfCollection, {
      tandem: options.tandem.createTandem( 'wolfNodeGroup' )
    } );
  }

  /**
   * Creates a WolfNode for a Wolf. Wires up a callback to handle disposal when the Wolf is disposed.
   * @param {Wolf} wolf
   * @returns {WolfNode}
   * @public
   */
  createWolfNode( wolf ) {
    assert && assert( wolf instanceof Wolf, 'invalid wolf' );

    // Create the WolfNode
    const wolfNode = this.wolfNodeGroup.createCorrespondingGroupElement( wolf.tandem.name, wolf );

    // If the wolf is disposed, dispose of the associated WolfNode.
    // removeListener is not necessary, because wolf.disposeEmitter is disposed.
    wolf.disposedEmitter.addListener( () => {
      this.wolfNodeGroup.disposeElement( wolfNode );
    } );

    return wolfNode;
  }
}

naturalSelection.register( 'WolfNodeCollection', WolfNodeCollection );
export default WolfNodeCollection;