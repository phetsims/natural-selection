// Copyright 2019-2020, University of Colorado Boulder

/**
 * AllelesPanel is the panel that contains controls for showing alleles in the 'Pedigree' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const Checkbox = require( 'SUN/Checkbox' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionPanel = require( 'NATURAL_SELECTION/common/view/NaturalSelectionPanel' );
  const PedigreeModel = require( 'NATURAL_SELECTION/common/model/PedigreeModel' );
  const SunConstants = require( 'SUN/SunConstants' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // images
  const brownFurImage = require( 'image!NATURAL_SELECTION/brownFur.png' );
  const straightEarsImage = require( 'image!NATURAL_SELECTION/straightEars.png' );
  const floppyEarsImage = require( 'image!NATURAL_SELECTION/floppyEars.png' );
  const longTeethImage = require( 'image!NATURAL_SELECTION/longTeeth.png' );
  const shortTeethImage = require( 'image!NATURAL_SELECTION/shortTeeth.png' );
  const whiteFurImage = require( 'image!NATURAL_SELECTION/whiteFur.png' );

  // strings
  const allelesString = require( 'string!NATURAL_SELECTION/alleles' );
  const earsDominantString = require( 'string!NATURAL_SELECTION/earsDominant' );
  const earsRecessiveString = require( 'string!NATURAL_SELECTION/earsRecessive' );
  const earsString = require( 'string!NATURAL_SELECTION/ears' );
  const furDominantString = require( 'string!NATURAL_SELECTION/furDominant' );
  const furRecessiveString = require( 'string!NATURAL_SELECTION/furRecessive' );
  const furString = require( 'string!NATURAL_SELECTION/fur' );
  const teethDominantString = require( 'string!NATURAL_SELECTION/teethDominant' );
  const teethRecessiveString = require( 'string!NATURAL_SELECTION/teethRecessive' );
  const teethString = require( 'string!NATURAL_SELECTION/teeth' );

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

          // Alleles
          new Text( allelesString, {
            font: NaturalSelectionConstants.TITLE_FONT,
            maxWidth: 125, // determined empirically
            tandem: options.tandem.createTandem( 'title' )
          } ),

          // Fur
          new Row(
            furString, furDominantString, furRecessiveString,
            brownFurImage, whiteFurImage,
            pedigreeModel.furAllelesVisibleProperty, pedigreeModel.furMutationExistsProperty,
            alleleAlignGroup, {
              tandem: options.tandem.createTandem( 'furRow' ),
              phetioReadOnly: true
            }
          ),

          // Ears
          new Row(
            earsString, earsDominantString, earsRecessiveString,
            straightEarsImage, floppyEarsImage,
            pedigreeModel.earsAllelesVisibleProperty, pedigreeModel.earsMutationExistsProperty,
            alleleAlignGroup, {
              tandem: options.tandem.createTandem( 'earsRow' ),
              phetioReadOnly: true
            }
          ),

          // Teeth
          new Row(
            teethString, teethDominantString, teethRecessiveString,
            longTeethImage, shortTeethImage,
            pedigreeModel.teethAllelesVisibleProperty, pedigreeModel.teethMutationExistsProperty,
            alleleAlignGroup, {
              tandem: options.tandem.createTandem( 'teethRow' ),
              phetioReadOnly: true
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
     * @param {HTMLImageElement} mutationIcon
     * @param {HTMLImageElement} nonMutationIcon
     * @param {Property.<boolean>} visibleProperty
     * @param {Property.<boolean>} enabledProperty
     * @param {AlignGroup} alignGroup
     * @param {Object} [options]
     */
    constructor( labelString, dominantString, recessiveString, mutationIcon, nonMutationIcon,
                 visibleProperty, enabledProperty, alignGroup, options ) {

      options = merge( {

        // VBox options
        align: 'left',
        spacing: 8,

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

      // Mutation abbreviation and icon
      const mutationText = new Text( dominantString, textOptions );
      const mutationImage = new Image( mutationIcon, imageOptions );
      const mutationHBox = new HBox( {
        children: [ mutationText, mutationImage ],
        spacing: textImageSpacing
      } );
      const mutationAlignBox = new AlignBox( mutationHBox, alignBoxOptions );

      // Non-mutation abbreviation and icon
      const nonMutationText = new Text( recessiveString, textOptions );
      const nonMutationImage = new Image( nonMutationIcon, imageOptions );
      const nonMutationHBox = new HBox( {
        children: [ nonMutationText, nonMutationImage ],
        spacing: textImageSpacing
      } );
      const nonMutationAlignBox = new AlignBox( nonMutationHBox, alignBoxOptions );

      // Indent the abbreviations and icons
      const hBox = new HBox( {
        spacing: 0,
        children: [
          new HStrut( 8 ),
          new HBox( {
            spacing: 12,
            children: [ mutationAlignBox, nonMutationAlignBox ]
          } )
        ]
      } );

      assert && assert( !options.children, 'Row sets children' );
      options.children = [ checkbox, hBox ];

      super( options);

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

  return naturalSelection.register( 'AllelesPanel', AllelesPanel );
} );