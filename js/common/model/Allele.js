// Copyright 2020, University of Colorado Boulder

/**
 * Allele is a variation of a gene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import AlleleIO from './AlleleIO.js';

class Allele extends PhetioObject {

  /**
   * @param {string} name - name of the allele
   * @param {Object} [options]
   */
  constructor( name, options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: AlleleIO
    }, options );

    super( options );

    // @public (read-only)
    this.name = name;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    throw new Error( 'dispose is not supported' );
  }
}

naturalSelection.register( 'Allele', Allele );
export default Allele;