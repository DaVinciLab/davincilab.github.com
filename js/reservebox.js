/**
 * Created by Yongnanzhu on 4/16/2014.
 */
/**
 * Created by Yongnanzhu on 4/16/2014.
 */
/**
 * @author mrdoob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Cube.as
 */

BoxGeometry = function ( min, max ) {

    THREE.Geometry.call( this );

    var scope = this;

    this.width = max.x - min.x;
    this.height = max.y - min.y;
    this.depth = max.z - min.z;

    this.widthSegments = 1;
    this.heightSegments = 1;
    this.depthSegments = 1;

    var width_half = this.width / 2;
    var height_half = this.height / 2;
    var depth_half = this.depth / 2;

    buildPlane( 'z', 'y', - 1, - 1, this.depth, this.height, width_half, 0 ); // px
    buildPlane( 'z', 'y',   1, - 1, this.depth, this.height, - width_half, 1 ); // nx
    buildPlane( 'x', 'z',   1,   1, this.width, this.depth, height_half, 2 ); // py
    buildPlane( 'x', 'z',   1, - 1, this.width, this.depth, - height_half, 3 ); // ny
    buildPlane( 'x', 'y',   1, - 1, this.width, this.height, depth_half, 4 ); // pz
    buildPlane( 'x', 'y', - 1, - 1, this.width, this.height, - depth_half, 5 ); // nz

    function buildBoxVertex(){
        // Process the vertex data.
        {

            scope.vertices.push( new THREE.Vector3(max.x, max.y, min.z) ); //1
            scope.vertices.push( new THREE.Vector3(max.x, min.y, min.z) ); //2
            scope.vertices.push( new THREE.Vector3(min.x, min.y, min.z) ); //3
            scope.vertices.push( new THREE.Vector3(min.x, max.y, min.z) ); //4

            scope.vertices.push( new THREE.Vector3(min.x, max.y, max.z) );  //5
            scope.vertices.push( new THREE.Vector3(min.x, min.y, max.z) ); //6
            scope.vertices.push( new THREE.Vector3(max.x, min.y, max.z) );  //7
            scope.vertices.push( new THREE.Vector3(max.x, max.y, max.z) );  //8
        }
    }
    function buildPlane(){
        var indices =
            [
                0,1,2,3,
                4,5,6,7,
                0,3,4,7,
                5,6,1,2,
                0,7,3,4,
                5,2,6,1
            ];

    }
    function buildPlane( u, v, udir, vdir, width, height, depth, materialIndex ) {

        var w, ix, iy,
            gridX = scope.widthSegments,
            gridY = scope.heightSegments,
            width_half = width / 2,
            height_half = height / 2,
            offset = scope.vertices.length;

        if ( ( u === 'x' && v === 'y' ) || ( u === 'y' && v === 'x' ) ) {

            w = 'z';

        } else if ( ( u === 'x' && v === 'z' ) || ( u === 'z' && v === 'x' ) ) {

            w = 'y';
            gridY = scope.depthSegments;

        } else if ( ( u === 'z' && v === 'y' ) || ( u === 'y' && v === 'z' ) ) {

            w = 'x';
            gridX = scope.depthSegments;

        }

        var gridX1 = gridX + 1,
            gridY1 = gridY + 1,
            segment_width = width / gridX,
            segment_height = height / gridY,
            normal = new THREE.Vector3();

        normal[ w ] = depth > 0 ? 1 : - 1;

        for ( iy = 0; iy < gridY1; iy ++ ) {

            for ( ix = 0; ix < gridX1; ix ++ ) {

                var vector = new THREE.Vector3();
                vector[ u ] = ( ix * segment_width - width_half ) * udir;
                vector[ v ] = ( iy * segment_height - height_half ) * vdir;
                vector[ w ] = depth;

                scope.vertices.push( vector );

            }

        }

        for ( iy = 0; iy < gridY; iy++ ) {

            for ( ix = 0; ix < gridX; ix++ ) {

                var a = ix + gridX1 * iy;
                var b = ix + gridX1 * ( iy + 1 );
                var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
                var d = ( ix + 1 ) + gridX1 * iy;

                var uva = new THREE.Vector2( ix / gridX, 1 - iy / gridY );
                var uvb = new THREE.Vector2( ix / gridX, 1 - ( iy + 1 ) / gridY );
                var uvc = new THREE.Vector2( ( ix + 1 ) / gridX, 1 - ( iy + 1 ) / gridY );
                var uvd = new THREE.Vector2( ( ix + 1 ) / gridX, 1 - iy / gridY );

                var face = new THREE.Face3( a + offset, b + offset, d + offset );
                face.normal.copy( normal );
                face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone() );
                face.materialIndex = materialIndex;

                scope.faces.push( face );
                scope.faceVertexUvs[ 0 ].push( [ uva, uvb, uvd ] );

                face = new THREE.Face3( b + offset, c + offset, d + offset );
                face.normal.copy( normal );
                face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone() );
                face.materialIndex = materialIndex;

                scope.faces.push( face );
                scope.faceVertexUvs[ 0 ].push( [ uvb.clone(), uvc, uvd.clone() ] );

            }

        }

    }

    this.computeCentroids();
    this.mergeVertices();

};

BoxGeometry.prototype = Object.create( THREE.Geometry.prototype );
