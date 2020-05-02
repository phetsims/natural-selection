// Copyright 2020, University of Colorado Boulder

/**
 * Gene is the basic physical and functional unit of heredity. An allele is a variation of a gene, and for this sim,
 * we assume that there will only be 2 alleles per gene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import PropertyIO from '../../../../axon/js/PropertyIO.js';
import merge from '../../../../phet-core/js/merge.js';
import Color from '../../../../scenery/js/util/Color.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
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
   * @param {Color|string} color - the color used to color-code things associated with this gene in the UI
   * @param {Object} [options]
   */
  constructor( name, normalAllele, mutantAllele, dominantSymbol, recessiveSymbol, color, options ) {

    assert && assert( typeof name === 'string', 'invalid name' );
    assert && assert( normalAllele instanceof Allele, 'invalid normalAllele' );
    assert && assert( mutantAllele instanceof Allele, 'invalid mutantAllele' );
    assert && assert( typeof dominantSymbol === 'string', 'invalid dominantSymbol' );
    assert && assert( typeof recessiveSymbol === 'string', 'invalid recessiveSymbol' );
    assert && assert( color instanceof Color || typeof color === 'string', 'invalid recessiveSymbol' );

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
    this.dominantSymbol = dominantSymbol;
    this.recessiveSymbol = recessiveSymbol;
    this.color = color;

    // @public {Allele|null} the dominate allele, null until the gene has mutated.  Until a mutation occurs, 
    // only the normal allele exists in the population, and the concepts of dominant and recessive are meaningless.
    this.dominantAlleleProperty = new Property( null, {
      validValues: [ null, normalAllele, mutantAllele ],
      phetioType: PropertyIO( NullableIO( AlleleIO ) ),
      tandem: options.tandem.createTandem( 'dominantAlleleProperty' ),
      phetioReadOnly: true
    } );

    // @public is a mutation coming in the next generation of bunnies?
    this.mutationComingProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'mutationComingProperty' ),
      phetioReadOnly: true
    } );
  }

  /**
   * @public
   */
  reset() {
    this.dominantAlleleProperty.reset();
    this.mutationComingProperty.reset();
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

