// Copyright 2019, University of Colorado Boulder

/**
 * NaturalSelectionScreenView is the base class for all ScreenViews in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AddMutationsPanel = require( 'NATURAL_SELECTION/common/view/AddMutationsPanel' );
  //TODO const DiedDialog = require( 'NATURAL_SELECTION/common/view/DiedDialog' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const EnvironmentalFactorsPanel = require( 'NATURAL_SELECTION/common/view/EnvironmentalFactorsPanel' );
  const EnvironmentDisplayNode = require( 'NATURAL_SELECTION/common/view/EnvironmentDisplayNode' );
  const Graphs = require( 'NATURAL_SELECTION/common/view/Graphs' );
  const GraphsRadioButtonGroup = require( 'NATURAL_SELECTION/common/view/GraphsRadioButtonGroup' );
  const merge = require( 'PHET_CORE/merge' );
  const MutationAlertsNode = require( 'NATURAL_SELECTION/common/view/MutationAlertsNode' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const PedigreeNode = require( 'NATURAL_SELECTION/common/view/pedigree/PedigreeNode' );
  const PopulationNode = require( 'NATURAL_SELECTION/common/view/population/PopulationNode' );
  const ProportionsNode = require( 'NATURAL_SELECTION/common/view/proportions/ProportionsNode' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Tandem = require( 'TANDEM/Tandem' );
  const TimeControlNode = require( 'SCENERY_PHET/TimeControlNode' );

  //TODO const WorldDialog = require( 'NATURAL_SELECTION/common/view/WorldDialog' );

  class NaturalSelectionScreenView extends ScreenView {

    /**
     * @param {NaturalSelectionModel} model
     * @param {NaturalSelectionViewProperties} viewProperties
     * @param {Object} [options]
     */
    constructor( model, viewProperties, options ) {

      options = merge( {

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      super( options );

      //TODO
      // Dialogs, displayed when the 'game' ends because bunnies have taken over the world, or all bunnies have died.
      // const diedDialog = new DiedDialog();
      // const worldDialog = new WorldDialog();

      const environmentDisplayNode = new EnvironmentDisplayNode( model, {
        left: this.layoutBounds.left + NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
        top: this.layoutBounds.top + NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: options.tandem.createTandem( 'environmentDisplayNode' )
      } );

      // Available width to the right of environmentDisplayNode, used to size control panels
      const rightOfViewportWidth = this.layoutBounds.width - environmentDisplayNode.width -
                                   ( 2 * NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN ) -
                                   NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

      const addMutationsPanel = new AddMutationsPanel( {
        fixedWidth: rightOfViewportWidth,
        left: environmentDisplayNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        top: environmentDisplayNode.top,
        tandem: options.tandem.createTandem( 'addMutationsPanel' )
      } );

      const mutationAlertsNode = new MutationAlertsNode( addMutationsPanel );

      const environmentalFactorsPanel = new EnvironmentalFactorsPanel( model.environmentModel, {
        fixedWidth: rightOfViewportWidth,
        left: environmentDisplayNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        top: addMutationsPanel.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING,
        tandem: options.tandem.createTandem( 'environmentalFactorsPanel' )
      } );

      // The graphs and their related controls fill the space below the viewport.
      const graphAreaSize = new Dimension2(
        environmentDisplayNode.width,
        this.layoutBounds.height - ( 2 * NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN ) -
        environmentDisplayNode.height - NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
      );
      const graphAreaLeft = environmentDisplayNode.left;
      const graphAreaTop = environmentDisplayNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING;

      // Population
      const populationNode = new PopulationNode( model.populationModel, graphAreaSize, {
        left: graphAreaLeft,
        top: graphAreaTop,
        tandem: options.tandem.createTandem( 'populationNode' )
      } );

      // Proportions
      const proportionsNode = new ProportionsNode( model.proportionsModel, graphAreaSize, {
        left: graphAreaLeft,
        top: graphAreaTop,
        tandem: options.tandem.createTandem( 'proportionsNode' )
      } );

      // Pedigree
      const pedigreeNode = new PedigreeNode( model.pedigreeModel, graphAreaSize, {
        left: graphAreaLeft,
        top: graphAreaTop,
        tandem: options.tandem.createTandem( 'pedigreeNode' )
      } );

      // Population, Proportions, Pedigree radio buttons
      const graphsRadioButtonGroup = new GraphsRadioButtonGroup( viewProperties.graphProperty, {
        maxWidth: rightOfViewportWidth,
        left: environmentDisplayNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        centerY: populationNode.centerY,
        tandem: options.tandem.createTandem( 'graphsRadioButtonGroup' )
      } );

      // Visibility of graphs is mutually exclusive
      viewProperties.graphProperty.link( graph => {
        populationNode.visible = ( graph === Graphs.POPULATION );
        proportionsNode.visible = ( graph === Graphs.PROPORTIONS );
        pedigreeNode.visible = ( graph === Graphs.PEDIGREE );
      } );

      // Play/pause/step time controls
      const timeControlNode = new TimeControlNode( model.isPlayingProperty, {
        stepOptions: {
          listener: () => model.stepOnce( NaturalSelectionConstants.SECONDS_PER_STEP )
        },
        left: environmentDisplayNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        bottom: this.layoutBounds.bottom - NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: options.tandem.createTandem( 'timeControlNode' )
      } );

      // Reset All push button
      const resetAllButton = new ResetAllButton( {
        listener: () => {
          this.interruptSubtreeInput();
          model.reset();
          this.reset();
        },
        right: this.layoutBounds.right - NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.bottom - NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: options.tandem.createTandem( 'resetAllButton' )
      } );

      // layering
      this.children = [
        environmentDisplayNode,
        addMutationsPanel,
        environmentalFactorsPanel,
        graphsRadioButtonGroup,
        timeControlNode,
        populationNode,
        proportionsNode,
        pedigreeNode,
        resetAllButton,
        mutationAlertsNode
      ];

      // @private
      this.resetNaturalSelectionScreenView = () => {
        environmentDisplayNode.reset();
        addMutationsPanel.reset();
        mutationAlertsNode.reset();
        populationNode.reset();
        //TODO
      };
    }

    /**
     * @public
     */
    reset() {
      this.resetNaturalSelectionScreenView();
    }

    /**
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {
      //TODO
    }
  }

  return naturalSelection.register( 'NaturalSelectionScreenView', NaturalSelectionScreenView );
} );