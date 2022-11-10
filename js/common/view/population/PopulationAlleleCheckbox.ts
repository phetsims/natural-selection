// Copyright 2021-2022, University of Colorado Boulder

/**
 * PopulationAlleleCheckbox is a specialization of PopulationLegendCheckbox for use with alleles.
 * It shows the name of the allele on the checkbox, and keeps a reference to that allele.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import { AlignGroup } from '../../../../../scenery/js/imports.js';
import naturalSelection from '../../../naturalSelection.js';
import Allele from '../../model/Allele.js';
import PopulationLegendCheckbox, { PopulationLegendCheckboxOptions } from './PopulationLegendCheckbox.js';

type SelfOptions = EmptySelfOptions;

type PopulationAlleleCheckboxOptions = SelfOptions & PopulationLegendCheckboxOptions;

export default class PopulationAlleleCheckbox extends PopulationLegendCheckbox {

  public readonly allele: Allele;

  /**
   * @param plotVisibleProperty - visibility of the associated plot on the Population graph
   * @param allele - the allele associated with this checkbox
   * @param alignGroup - to make all checkbox content have the same effective size
   * @param [providedOptions]
   */
  public constructor( plotVisibleProperty: Property<boolean>, allele: Allele, alignGroup: AlignGroup,
                      providedOptions: PopulationAlleleCheckboxOptions ) {

    super( plotVisibleProperty, allele.nameProperty, alignGroup, providedOptions );

    this.allele = allele;
  }
}

naturalSelection.register( 'PopulationAlleleCheckbox', PopulationAlleleCheckbox );