// Copyright 2020, University of Colorado Boulder

/**
 * Gene is the basic physical and functional unit of heredity. An allele is a variation of a gene, and for this sim,
 * we assume that there will only be 2 alleles per gene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import Property from '../../../../axon/js/Property.js';
import PropertyIO from '../../../../axon/js/PropertyIO.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import naturalSelection from '../../naturalSelection.js';
import Allele from './Allele.js';
import AlleleIO from './AlleleIO.js';
import GeneIO from './GeneIO.js';

class Gene extends PhetioObject {

  /**
   * @param {string} name
   * @param {Allele} normalAllele - the standard 'normal' or 'wild type' variant of the gene
   * @param {Allele} mutantAllele - the non-standard 'mutant' variant of the gene
   * @param {string} dominantSymbol - the symbol used to label the dominant allele
   * @param {string} recessiveSymbol - the symbol used to label the recessive allele
   * @param {Object} [options]
   */
  constructor( name, normalAllele, mutantAllele, dominantSymbol, recessiveSymbol, options ) {

    assert && assert( typeof name === 'string', 'invalid name' );
    assert && assert( normalAllele instanceof Allele, 'invalid normalAllele' );
    assert && assert( mutantAllele instanceof Allele, 'invalid mutantAllele' );
    assert && assert( typeof dominantSymbol === 'string', 'invalid dominantSymbol' );
    assert && assert( typeof recessiveSymbol === 'string', 'invalid recessiveSymbol' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: GeneIO
    }, options );

    super( options );

    // @public (read-only)
    this.name = name;
    this.normalAllele = normalAllele;
    this.mutantAllele = mutantAllele;

    // @public (read-only) symbols used to label the alleles
    this.dominantSymbol = dominantSymbol;
    this.recessiveSymbol = recessiveSymbol;

    // @public {Allele|null} the dominate allele, null until the gene has mutated.  Until a mutation occurs, 
    // only the normal allele exists in the population, and the concepts of dominant and recessive are meaningless.
    this.dominantAlleleProperty = new Property( null, {
      validValues: [ null, normalAllele, mutantAllele ],
      phetioType: PropertyIO( NullableIO( AlleleIO ) ),
      tandem: options.tandem.createTandem( 'dominantAlleleProperty' ),
      phetioReadOnly: true
    } );

    // @public {DerivedProperty.<boolean>} has this gene mutated?
    this.hasMutatedProperty = new DerivedProperty(
      [ this.dominantAlleleProperty ],
      dominantAllele => ( dominantAllele !== null ), {
        tandem: options.tandem.createTandem( 'hasMutatedProperty' ),
        phetioType: DerivedPropertyIO( BooleanIO )
      } );
  }

  /**
   * @public
   */
  reset() {
    this.dominantAlleleProperty.reset();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    throw new Error( 'dispose is not supported' );
  }
}

naturalSelection.register( 'Gene', Gene );
export default Gene;

