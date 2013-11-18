define([
  'aeris/util',
  'gmaps/utils',
  'gmaps/abstractstrategy'
], function(_, mapUtil, AbstractStrategy) {
  /**
   * Strategy for rendering markers.
   *
   * @class aeris.maps.gmaps.markerstrategies.MarkerStrategy
   * @extends aeris.maps.AbstractStrategy
   * @param {aeris.maps.Marker} marker
   * @constructor
   */
  var MarkerStrategy = function(marker) {
    this.marker_ = marker;

    AbstractStrategy.call(this, this.marker_);

    this.proxyViewEvents_();

    this.listenTo(this.marker_, {
      'change:url': this.updateUrl_,
      'change:position': this.updatePosition_,
      'change:title': this.updateTitle_
    });
  };
  _.inherits(MarkerStrategy, AbstractStrategy);


  /**
   * @override
   */
  MarkerStrategy.prototype.createView_ = function() {
    return new google.maps.Marker(this.getViewOptions_());
  };


  /**
   * @override
   */
  MarkerStrategy.prototype.setMap = function(aerisMap) {
    AbstractStrategy.prototype.setMap.apply(this, arguments);

    this.getView().setMap(this.mapView_);
  };


  /**
   * @override
   */
  MarkerStrategy.prototype.beforeRemove_ = function() {
    this.getView().setMap(null);
  };


  /**
   * @return {Object} Options for creating the {google.maps.Maker} view.
   */
  MarkerStrategy.prototype.getViewOptions_ = function() {
    return {
      position: mapUtil.arrayToLatLng(this.marker_.get('position')),
      icon: this.marker_.get('url'),
      anchorPoint: new google.maps.Point(
        this.marker_.get('offsetX'),
        this.marker_.get('offsetY')
      ),
      flat: true,
      clickable: this.marker_.get('clickable'),
      draggable: this.marker_.get('draggable'),
      title: this.marker_.get('title')
    };
  };


  /**
   * Trigger google map events
   * on the marker object.
   *
   * @private
   */
  MarkerStrategy.prototype.proxyViewEvents_ = function() {
    this.googleEvents_.listenTo(this.getView(), {
      click: function(evt) {
        var latLon = mapUtil.latLngToArray(evt.latLng);
        this.marker_.trigger('click', latLon, this.marker_);
      },
      dragend: function(evt) {
        var latLon = mapUtil.latLngToArray(evt.latLng);
        this.marker_.trigger('dragend', latLon, this.marker_);

        // Update marker object position attribute
        this.marker_.setPosition(latLon);
      }
    }, this);
  };


  /**
   * @private
   */
  MarkerStrategy.prototype.updatePosition_ = function() {
    var latLng = mapUtil.arrayToLatLng(this.marker_.get('position'));
    this.getView().setPosition(latLng);
  };


  /**
   * @private
   */
  MarkerStrategy.prototype.updateUrl_ = function() {
    this.getView().setIcon(this.marker_.get('url'));
  };


  /**
   * @private
   */
  MarkerStrategy.prototype.updateTitle_ = function() {
    this.getView().setTitle(this.marker_.get('title'));
  };


  return MarkerStrategy;
});