// Copyright 2019-2022, University of Colorado Boulder

/**
 * ProportionsPanel is the panel that contains controls for the 'Proportions' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../../phetcommon/js/AssertUtils.js';
import { HSeparator, Text, VBox } from '../../../../../scenery/js/imports.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionStrings from '../../../NaturalSelectionStrings.js';
import GenePool from '../../model/GenePool.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionPanel from '../NaturalSelectionPanel.js';
import ProportionsLegendNode from './ProportionsLegendNode.js';

export default class ProportionsPanel extends NaturalSelectionPanel {

  /**
   * @param {GenePool} genePool
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {Object} [options]
   */
  constructor( genePool, valuesVisibleProperty, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && AssertUtils.assertPropertyOf( valuesVisibleProperty, 'boolean' );

    options = merge( {
      fixedWidth: 100,
      xMargin: 0,

      // phet-io
      tandem: Tandem.REQUIRED
    }, NaturalSelectionConstants.PANEL_OPTIONS, options );

    const legendNode = new ProportionsLegendNode( genePool, {
      tandem: options.tandem.createTandem( 'legendNode' )
    } );

    const separator = new HSeparator( {
      stroke: NaturalSelectionColors.SEPARATOR_STROKE
    } );

    // Values checkbox, shows/hides values on the bars
    const valuesCheckboxTandem = options.tandem.createTandem( 'valuesCheckbox' );
    const valuesCheckboxLabelText = new Text( NaturalSelectionStrings.valuesStringProperty, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 100, // determined empirically
      tandem: valuesCheckboxTandem.createTandem( 'labelText' )
    } );
    const valuesCheckbox = new Checkbox( valuesVisibleProperty, valuesCheckboxLabelText, merge( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, {
      tandem: valuesCheckboxTandem
    } ) );
    const xDilation = 8;
    const yDilation = 6;
    valuesCheckbox.touchArea = valuesCheckbox.localBounds.dilatedXY( xDilation, yDilation );
    valuesCheckbox.mouseArea = valuesCheckbox.localBounds.dilatedXY( xDilation, yDilation );

    const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      preferredWidth: options.fixedWidth - ( 2 * options.xMargin ),
      children: [
        legendNode,
        separator,
        valuesCheckbox
      ]
    } ) );

    super( content, options );

    // @private {ProportionsLegendNode}
    this.legendNode = legendNode;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Sets visibility of the UI components related to a specific gene.
   * @param {Gene} gene
   * @param {boolean} visible
   * @public
   */
  setGeneVisible( gene, visible ) {
    this.legendNode.setGeneVisible( gene, visible );
  }
}

naturalSelection.register( 'ProportionsPanel', ProportionsPanel );