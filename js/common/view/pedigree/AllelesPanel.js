// Copyright 2019-2020, University of Colorado Boulder

/**
 * AllelesPanel is the panel that contains controls for showing alleles in the 'Pedigree' graph.
 * Each row in the panel corresponds to one trait.  Until the gene for a trait has mutated, its row is disabled.
 * When a row is enabled, it shows the icon and abbreviation for the normal allele and the mutant allele.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import AlignBox from '../../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import HStrut from '../../../../../scenery/js/nodes/HStrut.js';
import Image from '../../../../../scenery/js/nodes/Image.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import SunConstants from '../../../../../sun/js/SunConstants.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import brownFurImage from '../../../../images/brownFur_png.js';
import floppyEarsImage from '../../../../images/floppyEars_png.js';
import longTeethImage from '../../../../images/longTeeth_png.js';
import shortTeethImage from '../../../../images/shortTeeth_png.js';
import straightEarsImage from '../../../../images/straightEars_png.js';
import whiteFurImage from '../../../../images/whiteFur_png.js';
import naturalSelection from '../../../naturalSelection.js';
import naturalSelectionStrings from '../../../naturalSelectionStrings.js';
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

        // Alleles - plural since we're always showing at least 2 alleles
        new Text( naturalSelectionStrings.alleles, {
          font: NaturalSelectionConstants.TITLE_FONT,
          maxWidth: 125, // determined empirically
          tandem: options.tandem.createTandem( 'title' )
        } ),

        // Fur
        new Row(
          naturalSelectionStrings.fur, naturalSelectionStrings.furDominant, naturalSelectionStrings.furRecessive,
          brownFurImage, whiteFurImage,
          pedigreeModel.furAllelesVisibleProperty, pedigreeModel.furMutationExistsProperty,
          alleleAlignGroup, {
            tandem: options.tandem.createTandem( 'furRow' )
          }
        ),

        // Ears
        new Row(
          naturalSelectionStrings.ears, naturalSelectionStrings.earsDominant, naturalSelectionStrings.earsRecessive,
          straightEarsImage, floppyEarsImage,
          pedigreeModel.earsAllelesVisibleProperty, pedigreeModel.earsMutationExistsProperty,
          alleleAlignGroup, {
            tandem: options.tandem.createTandem( 'earsRow' )
          }
        ),

        // Teeth
        new Row(
          naturalSelectionStrings.teeth, naturalSelectionStrings.teethDominant, naturalSelectionStrings.teethRecessive,
          longTeethImage, shortTeethImage,
          pedigreeModel.teethAllelesVisibleProperty, pedigreeModel.teethMutationExistsProperty,
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
   * @param {string} labelString
   * @param {string} dominantString
   * @param {string} recessiveString
   * @param {HTMLImageElement} mutantIcon
   * @param {HTMLImageElement} normalIcon
   * @param {Property.<boolean>} visibleProperty
   * @param {Property.<boolean>} enabledProperty
   * @param {AlignGroup} alignGroup
   * @param {Object} [options]
   */
  constructor( labelString, dominantString, recessiveString, mutantIcon, normalIcon,
               visibleProperty, enabledProperty, alignGroup, options ) {

    options = merge( {

      // VBox options
      align: 'left',
      spacing: 8,
      excludeInvisibleChildrenFromBounds: false,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const labelNode = new Text( labelString, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 100 // determined empirically
    } );
    const checkbox = new Checkbox( labelNode, visibleProperty,
      merge( {
        tandem: options.tandem.createTandem( 'checkbox' )
      }, NaturalSelectionConstants.CHECKBOX_OPTIONS )
    );

    // common options
    const textOptions = {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 12 // determined empirically
    };
    const imageOptions = {
      scale: 0.5 // determined empirically
    };
    const alignBoxOptions = {
      group: alignGroup,
      xAlign: 'left'
    };
    const textImageSpacing = 6;

    // mutant allele abbreviation and icon
    const mutantText = new Text( dominantString, textOptions );
    const mutantImage = new Image( mutantIcon, imageOptions );
    const mutantHBox = new HBox( {
      children: [ mutantText, mutantImage ],
      spacing: textImageSpacing
    } );
    const mutantAlignBox = new AlignBox( mutantHBox, alignBoxOptions );

    // Normal allele abbreviation and icon
    const normalText = new Text( recessiveString, textOptions );
    const normalImage = new Image( normalIcon, imageOptions );
    const normalHBox = new HBox( {
      children: [ normalText, normalImage ],
      spacing: textImageSpacing
    } );
    const normalAlignBox = new AlignBox( normalHBox, alignBoxOptions );

    // Indent the abbreviations and icons
    const hBox = new HBox( {
      spacing: 0,
      children: [
        new HStrut( 8 ),
        new HBox( {
          spacing: 12,
          children: [ mutantAlignBox, normalAlignBox ]
        } )
      ]
    } );

    assert && assert( !options.children, 'Row sets children' );
    options.children = [ checkbox, hBox ];

    super( options );

    enabledProperty.link( enabled => {

      // Disable this row
      this.opacity = enabled ? 1 : SunConstants.DISABLED_OPACITY;
      checkbox.pickable = enabled;

      // don't show allele abbreviation and icon when disabled
      hBox.visible = enabled;

      //TODO when enabled, set order of icons so that dominant is on the left
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

naturalSelection.register( 'AllelesPanel', AllelesPanel );
export default AllelesPanel;