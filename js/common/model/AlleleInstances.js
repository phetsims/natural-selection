// Copyright 2020, University of Colorado Boulder

/**
 * AlleleInstances defines a set of Allele instances that are used throughout the sim.
 * These must be in their own .js file (versus in Allele.js) to avoid the cyclic dependency between Allele and AlleleIO.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import brownFurImage from '../../../images/brownFur_png.js';
import floppyEarsImage from '../../../images/floppyEars_png.js';
import longTeethImage from '../../../images/longTeeth_png.js';
import shortTeethImage from '../../../images/shortTeeth_png.js';
import straightEarsImage from '../../../images/straightEars_png.js';
import whiteFurImage from '../../../images/whiteFur_png.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import Allele from './Allele.js';

// tandem for all static instances of Solute, which are used across all screens
const ALLELES_TANDEM = Tandem.GLOBAL.createTandem( 'model' ).createTandem( 'alleles' );

const AlleleInstances = {

  WHITE_FUR: new Allele( naturalSelectionStrings.whiteFur, whiteFurImage, {
    tandem: ALLELES_TANDEM.createTandem( 'whiteFur' )
  } ),

  BROWN_FUR: new Allele( naturalSelectionStrings.brownFur, brownFurImage, {
    tandem: ALLELES_TANDEM.createTandem( 'brownFur' )
  } ),

  FLOPPY_EARS: new Allele( naturalSelectionStrings.floppyEars, floppyEarsImage, {
    tandem: ALLELES_TANDEM.createTandem( 'floppyEars' )
  } ),

  STRAIGHT_EARS: new Allele( naturalSelectionStrings.straightEars, straightEarsImage, {
    tandem: ALLELES_TANDEM.createTandem( 'straightEars' )
  } ),

  SHORT_TEETH: new Allele( naturalSelectionStrings.shortTeeth, shortTeethImage, {
    tandem: ALLELES_TANDEM.createTandem( 'shortTeeth' )
  } ),

  LONG_TEETH: new Allele( naturalSelectionStrings.longTeeth, longTeethImage, {
    tandem: ALLELES_TANDEM.createTandem( 'longTeeth' )
  } )
};

naturalSelection.register( 'AlleleInstances', AlleleInstances );
export default AlleleInstances;