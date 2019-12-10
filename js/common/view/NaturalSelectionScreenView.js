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
  const GraphRadioButtonGroup = require( 'NATURAL_SELECTION/common/view/GraphRadioButtonGroup' );
  const Graphs = require( 'NATURAL_SELECTION/common/view/Graphs' );
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
  const ViewportNode = require( 'NATURAL_SELECTION/common/view/ViewportNode' );

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
        tandem: Tandem.required
      }, options );

      super( options );

      //TODO
      // Dialogs, displayed when the 'game' ends because bunnies have taken over the world, or all bunnies have died.
      // const diedDialog = new DiedDialog();
      // const worldDialog = new WorldDialog();

      const viewportNode = new ViewportNode( model, {
        left: this.layoutBounds.left + NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
        top: this.layoutBounds.top + NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: options.tandem.createTandem( 'viewportNode' )
      } );

      // Available width to the right of viewportNode, used to size control panels
      const rightOfViewportWidth = this.layoutBounds.width - viewportNode.width -
                                   ( 2 * NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN ) -
                                   NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

      const addMutationsPanel = new AddMutationsPanel( {
        fixedWidth: rightOfViewportWidth,
        left: viewportNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        top: viewportNode.top,
        tandem: options.tandem.createTandem( 'addMutationsPanel' )
      } );

      const mutationAlertsNode = new MutationAlertsNode( addMutationsPanel );

      const environmentalFactorsPanel = new EnvironmentalFactorsPanel( model.environmentModel, {
        fixedWidth: rightOfViewportWidth,
        left: viewportNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        top: addMutationsPanel.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING,
        tandem: options.tandem.createTandem( 'environmentalFactorsPanel' )
      } );

      // The graphs and their related controls fill the space below the viewport.
      const graphAreaSize = new Dimension2(
        viewportNode.width,
        this.layoutBounds.height - ( 2 * NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN ) -
        viewportNode.height - NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
      );
      const graphAreaLeft = viewportNode.left;
      const graphAreaTop = viewportNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING;

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
      const graphRadioButtonGroup = new GraphRadioButtonGroup( viewProperties.graphProperty, {
        maxWidth: rightOfViewportWidth,
        left: viewportNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        centerY: populationNode.centerY,
        tandem: options.tandem.createTandem( 'graphRadioButtonGroup' )
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
        left: viewportNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
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
        viewportNode,
        addMutationsPanel,
        environmentalFactorsPanel,
        graphRadioButtonGroup,
        timeControlNode,
        populationNode,
        proportionsNode,
        pedigreeNode,
        resetAllButton,
        mutationAlertsNode
      ];

      // @private
      this.resetNaturalSelectionScreenView = () => {
        viewportNode.reset();
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

    /**
     * Cancels a scheduled mutation.
     * @private
     */
    cancelMutation() {
      //TODO
    }
  }

  return naturalSelection.register( 'NaturalSelectionScreenView', NaturalSelectionScreenView );
} );