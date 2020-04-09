// Copyright 2020, University of Colorado Boulder

/**
 * AlleleInstances defines a set of Allele instances that are used throughout the sim.
 * These must be in their own .js file (versus in Allele.js) to avoid the cyclic dependency between Allele and AlleleIO.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import Allele from './Allele.js';

// tandem for all static instances of Solute, which are used across all screens
const ALLELES_TANDEM = Tandem.GLOBAL.createTandem( 'model' ).createTandem( 'alleles' );

const AlleleInstances = {

  WHITE_FUR: new Allele( naturalSelectionStrings.whiteFur, {
    tandem: ALLELES_TANDEM.createTandem( 'whiteFur' )
  } ),

  BROWN_FUR: new Allele( naturalSelectionStrings.brownFur, {
    tandem: ALLELES_TANDEM.createTandem( 'brownFur' )
  } ),

  FLOPPY_EARS: new Allele( naturalSelectionStrings.floppyEars, {
    tandem: ALLELES_TANDEM.createTandem( 'floppyEars' )
  } ),

  STRAIGHT_EARS: new Allele( naturalSelectionStrings.straightEars, {
    tandem: ALLELES_TANDEM.createTandem( 'straightEars' )
  } ),

  SHORT_TEETH: new Allele( naturalSelectionStrings.shortTeeth, {
    tandem: ALLELES_TANDEM.createTandem( 'shortTeeth' )
  } ),

  LONG_TEETH: new Allele( naturalSelectionStrings.longTeeth, {
    tandem: ALLELES_TANDEM.createTandem( 'longTeeth' )
  } )
};

naturalSelection.register( 'AlleleInstances', AlleleInstances );
export default AlleleInstances;