// Copyright 2021-2022, University of Colorado Boulder

/**
 * PopulationAlleleCheckbox is a specialization of PopulationLegendCheckbox for use with alleles.
 * It shows the name of the allele on the checkbox, and keeps a reference to that allele.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../../../naturalSelection.js';
import Allele from '../../model/Allele.js';
import PopulationLegendCheckbox from './PopulationLegendCheckbox.js';

class PopulationAlleleCheckbox extends PopulationLegendCheckbox {

  /**
   * @param {Property.<boolean>} plotVisibleProperty - visibility of the associated plot on the Population graph
   * @param {Allele} allele - the allele associated with this checkbox
   * @param {AlignGroup} alignGroup - to make all checkbox content have the same effective size
   * @param {Object} [options]
   */
  constructor( plotVisibleProperty, allele, alignGroup, options ) {

    assert && assert( allele instanceof Allele, 'invalid allele' );

    super( plotVisibleProperty, allele.nameProperty, alignGroup, options );

    // @public (read-only)
    this.allele = allele;
  }
}

naturalSelection.register( 'PopulationAlleleCheckbox', PopulationAlleleCheckbox );
export default PopulationAlleleCheckbox;