// Copyright 2019-2020, University of Colorado Boulder

/**
 * AllelesPanel is the panel that contains controls for showing alleles in the 'Pedigree' graph.
 * Each row in the panel corresponds to one trait.  Until the gene for a trait has mutated, its row is disabled.
 * When a row is enabled, it shows the icon and abbreviation for the normal allele and the mutant allele.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import merge from '../../../../../phet-core/js/merge.js';
import AlignBox from '../../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import HStrut from '../../../../../scenery/js/nodes/HStrut.js';
import Image from '../../../../../scenery/js/nodes/Image.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import brownFurImage from '../../../../images/brownFur_png.js';
import floppyEarsImage from '../../../../images/floppyEars_png.js';
import longTeethImage from '../../../../images/longTeeth_png.js';
import shortTeethImage from '../../../../images/shortTeeth_png.js';
import straightEarsImage from '../../../../images/straightEars_png.js';
import whiteFurImage from '../../../../images/whiteFur_png.js';
import naturalSelection from '../../../naturalSelection.js';
import naturalSelectionStrings from '../../../naturalSelectionStrings.js';
import Gene from '../../model/Gene.js';
import PedigreeModel from '../../model/PedigreeModel.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionPanel from '../NaturalSelectionPanel.js';

class AllelesPanel extends NaturalSelectionPanel {

  /**
   * @param {PedigreeModel} pedigreeModel
   * @param {Object} [options]
   */
  constructor( pedigreeModel, options ) {

    assert && assert( pedigreeModel instanceof PedigreeModel, 'invalid pedigreeModel' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, NaturalSelectionConstants.PANEL_OPTIONS, options );

    // To make the abbreviation + icon for all alleles the same effective size
    const alleleAlignGroup = new AlignGroup();

    const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      spacing: 25,
      children: [

        // Alleles - title is plural, since we're always showing at least 2 alleles
        new Text( naturalSelectionStrings.alleles, {
          font: NaturalSelectionConstants.TITLE_FONT,
          maxWidth: 125, // determined empirically
          tandem: options.tandem.createTandem( 'titleNode' )
        } ),

        // Fur
        new Row(
          pedigreeModel.genePool.furGene,
          whiteFurImage, brownFurImage,
          pedigreeModel.furAllelesVisibleProperty,
          alleleAlignGroup, {
            tandem: options.tandem.createTandem( 'furRow' )
          }
        ),

        // Ears
        new Row(
          pedigreeModel.genePool.earsGene,
          straightEarsImage, floppyEarsImage,
          pedigreeModel.earsAllelesVisibleProperty,
          alleleAlignGroup, {
            tandem: options.tandem.createTandem( 'earsRow' )
          }
        ),

        // Teeth
        new Row(
          pedigreeModel.genePool.teethGene,
          shortTeethImage, longTeethImage,
          pedigreeModel.teethAllelesVisibleProperty,
          alleleAlignGroup, {
            tandem: options.tandem.createTandem( 'teethRow' )
          }
        )
      ]
    } ) );

    super( content, options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'AllelesPanel does not support dispose' );
  }
}

/**
 * Row is a row in AllelesPanel.
 *
 * Each row has a checkbox for showing allele abbreviations in the Pedigree graph, and icons that indicate the
 * phenotype for each abbreviation (e.g. 'F' <white fur icon>  'f' <brown fur icon>).  A row is hidden until
 * its corresponding mutation has been applied.
 */
class Row extends VBox {

  /**
   * @param {Gene} gene
   * @param {HTMLImageElement} normalAlleleImage
   * @param {HTMLImageElement} mutantAlleleImage
   * @param {Property.<boolean>} visibleProperty
   * @param {AlignGroup} alignGroup
   * @param {Object} [options]
   */
  constructor( gene, normalAlleleImage, mutantAlleleImage, visibleProperty, alignGroup, options ) {

    assert && assert( gene instanceof Gene, 'invalid gene' );
    assert && assert( normalAlleleImage instanceof HTMLImageElement, 'invalid normalAlleleImage' );
    assert && assert( mutantAlleleImage instanceof HTMLImageElement, 'invalid mutantAlleleImage' );
    assert && assert( visibleProperty instanceof Property, 'invalid visibleProperty' );
    assert && assert( alignGroup instanceof AlignGroup, 'invalid alignGroup' );

    options = merge( {

      // VBox options
      align: 'left',
      spacing: 8,
      excludeInvisibleChildrenFromBounds: false,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const labelNode = new Text( gene.name, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 100 // determined empirically
    } );

    const checkbox = new Checkbox( labelNode, visibleProperty,
      merge( {
        tandem: options.tandem.createTandem( 'checkbox' ),
        phetioComponentOptions: { visibleProperty: { phetioReadOnly: true } }
      }, NaturalSelectionConstants.CHECKBOX_OPTIONS )
    );

    // Dominant allele
    const dominantAlleleNode = new AlleleNode( gene.dominantSymbol, normalAlleleImage );

    // Recessive allele
    const recessiveAlleleNode = new AlleleNode( gene.recessiveSymbol, mutantAlleleImage );

    const alignBoxOptions = {
      group: alignGroup,
      xAlign: 'left'
    };

    // Dominant allele on the left, recessive on the right, to match 'Add Mutations' panel
    const hBox = new HBox( {
      spacing: 0,
      children: [
        new HStrut( 8 ), // indent
        new HBox( {
          spacing: 12,
          children: [
            new AlignBox( dominantAlleleNode, alignBoxOptions ),
            new AlignBox( recessiveAlleleNode, alignBoxOptions )
          ]
        } )
      ]
    } );

    assert && assert( !options.children, 'Row sets children' );
    options.children = [ checkbox, hBox ];

    super( options );

    gene.dominantAlleleProperty.link( dominantAllele => {

      const hasMutation = !!dominantAllele;

      // Disable the checkbox when there is no mutation
      checkbox.enabled = hasMutation;

      // Don't show allele abbreviation and icon when there is no mutation
      hBox.visible = hasMutation;

      // Corresponding alleles should not be visible when the row is disabled.
      if ( !hasMutation ) {
        visibleProperty.value = false;
      }

      if ( dominantAllele ) {

        // Show the correct allele icons for dominant vs recessive
        const mutantIsDominant = ( dominantAllele === gene.mutantAllele );
        dominantAlleleNode.image = mutantIsDominant ? mutantAlleleImage : normalAlleleImage;
        recessiveAlleleNode.image = mutantIsDominant ? normalAlleleImage : mutantAlleleImage;
      }
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'Row does not support dispose' );
  }
}

/**
 * AlleleNode displays the symbol and icon for an allele.
 */
class AlleleNode extends HBox {

  /**
   * @param {string} symbol - the symbol used for the allele
   * @param {HTMLImageElement} image
   * @param {Object} [options]
   */
  constructor( symbol, image, options ) {

    assert && assert( typeof symbol === 'string', 'invalid symbol' );
    assert && assert( image instanceof HTMLImageElement, 'invalid image' );

    options = merge( {
      spacing: 6
    }, options );

    const textNode = new Text( symbol, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 12 // determined empirically
    } );

    const imageNode = new Image( image, {
      scale: 0.5 // determined empirically
    } );

    assert && assert( !options.children, 'AlleleNode sets children' );
    options.children = [ textNode, imageNode ];

    super( options );

    // @private
    this.imageNode = imageNode;
  }

  /**
   * Sets the allele image for this node.
   * @param {HTMLImageElement} value
   */
  set image( value ) {
    assert && assert( value instanceof HTMLImageElement, 'invalid value' );
    this.imageNode.image = value;
  }
}

naturalSelection.register( 'AllelesPanel', AllelesPanel );
export default AllelesPanel;