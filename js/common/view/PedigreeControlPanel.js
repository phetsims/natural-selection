// Copyright 2019, University of Colorado Boulder

//TODO add icons and allele abbreviations
/**
 * PedigreeControlPanel is the panel that contains controls for the 'Pedigree' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  // const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionPanel = require( 'NATURAL_SELECTION/common/view/NaturalSelectionPanel' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // images
  // const brownFurIcon = require( 'image!NATURAL_SELECTION/brownFur.png' );
  // const straightEarsImage = require( 'image!NATURAL_SELECTION/straightEars.png' );
  // const floppyEarsImage = require( 'image!NATURAL_SELECTION/floppyEars.png' );
  // const mutationIconImage = require( 'image!NATURAL_SELECTION/mutationIcon.png' );
  // const longTeethImage = require( 'image!NATURAL_SELECTION/longTeeth.png' );
  // const shortTeethImage = require( 'image!NATURAL_SELECTION/shortTeeth.png' );
  // const whiteFurImage = require( 'image!NATURAL_SELECTION/whiteFur.png' );

  // strings
  const allelesString = require( 'string!NATURAL_SELECTION/alleles' );
  // const earsDominantString = require( 'string!NATURAL_SELECTION/earsDominant' );
  // const earsRecessiveString = require( 'string!NATURAL_SELECTION/earsRecessive' );
  const earsString = require( 'string!NATURAL_SELECTION/ears' );
  // const furDominantString = require( 'string!NATURAL_SELECTION/furDominant' );
  // const furRecessiveString = require( 'string!NATURAL_SELECTION/furRecessive' );
  const furString = require( 'string!NATURAL_SELECTION/fur' );
  // const teethDominantString = require( 'string!NATURAL_SELECTION/teethDominant' );
  // const teethRecessiveString = require( 'string!NATURAL_SELECTION/teethRecessive' );
  const teethString = require( 'string!NATURAL_SELECTION/teeth' );

  class PedigreeControlPanel extends NaturalSelectionPanel {

    /**
     * @param {PedigreeModel} pedigreeModel
     * @param {Object} [options]
     */
    constructor( pedigreeModel, options ) {

      options = merge( {}, NaturalSelectionConstants.PANEL_OPTIONS, options );

      // Alleles title
      const titleNode = new Text( allelesString, {
        font: NaturalSelectionConstants.TITLE_FONT
      } );

      // Checkbox for each gene
      const textOptions = { font: NaturalSelectionConstants.CHECKBOX_FONT };
      const checkboxes = [

        // Fur
        new Checkbox( new Text( furString, textOptions ), pedigreeModel.furVisibleProperty,
          merge( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, { enabledProperty: pedigreeModel.furEnabledProperty } ) ),

        // Ears
        new Checkbox( new Text( earsString, textOptions ), pedigreeModel.earsVisibleProperty,
          merge( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, { enabledProperty: pedigreeModel.earsEnabledProperty } ) ),

        // Teeth
        new Checkbox( new Text( teethString, textOptions ), pedigreeModel.teethVisibleProperty,
          merge( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, { enabledProperty: pedigreeModel.teethEnabledProperty } ) )
      ];

      // Arranged vertically
      const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
        children: [ titleNode, ...checkboxes ]
      } ) );

      super( content, options );
    }
  }

  return naturalSelection.register( 'PedigreeControlPanel', PedigreeControlPanel );
} );