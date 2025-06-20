// a lot of the credits for this component goes to my institute's deputy director, thank you for this! it helps a lot :)

AFRAME.registerComponent('borise', {
  schema: {
    // How far the eye should stay from the player
    distance: { type: 'number', default: 4 },
    // Height of the eye above the ground
    height: { type: 'number', default: 0.5 },
    // How fast the eye follows the player (0-1, higher is faster)
    followSpeed: { type: 'number', default: 0.08 },
    // Speed of rotation when moving to stay in view (degrees per second)
    rotationSpeed: { type: 'number', default: 90 }
  },
init: function() {
    // Store the initial eye position
    this.eyePosition = new THREE.Vector3();
    this.el.object3D.getWorldPosition(this.eyePosition);
    
    // Store the target position where the eye should move to
    this.targetPosition = new THREE.Vector3();
    this.basePosition = new THREE.Vector3();
    
    // Current angle relative to camera forward
    this.currentAngle = 0;
    
    // Flag to track if we're currently in a repositioning movement
    this.isRepositioning = false;
    
    // Timer for repositioning delay
    this.repositionTimer = 0;
    
    // Last recorded camera direction
    this.lastCameraDirection = new THREE.Vector3(0, 0, -1);
    
    // Set a buffer to avoid constant repositioning
    this.fieldOfViewThreshold = 0.5; // cos(60 degrees) ≈ 0.5
  },
  
  tick: function(time, deltaTime) {
    const deltaSeconds = deltaTime / 1000;
    
    // Get the camera (player) position and direction
    const camera = document.querySelector('[camera]');
    if (!camera) return;
    
    const cameraPosition = new THREE.Vector3();
    camera.object3D.getWorldPosition(cameraPosition);
    
    const cameraDirection = new THREE.Vector3(0, 0, -1);
    cameraDirection.applyQuaternion(camera.object3D.quaternion);
    
    // Get eye position
    const eyePosition = new THREE.Vector3();
    this.el.object3D.getWorldPosition(eyePosition);
    
    // Vector from camera to eye
    const cameraToEye = eyePosition.clone().sub(cameraPosition).normalize();
    
    // Dot product tells us if the eye is in front of the camera
    // 1 means directly in front, -1 means directly behind, 0 means perpendicular
    const dotProduct = cameraDirection.dot(cameraToEye);
    
    // Check if the eye is out of the field of view or too far
    const distanceToCamera = cameraPosition.distanceTo(eyePosition);
    const needsRepositioning = dotProduct < this.fieldOfViewThreshold || 
                               distanceToCamera > this.data.distance * 2 ||
                               distanceToCamera < this.data.distance * 0.5;
                               
    // If angle changed significantly or we need repositioning, start a move
    if (needsRepositioning && !this.isRepositioning) {
      this.isRepositioning = true;
      this.repositionTimer = 0;
      
      // Store current camera direction for the movement
      this.lastCameraDirection = cameraDirection.clone();
    }
    
    // Calculate the base position (without float)
    if (this.isRepositioning) {
      this.repositionTimer += deltaSeconds;
      
      // Calculate ideal position in front of camera
      this.basePosition.copy(cameraPosition).add(
        this.lastCameraDirection.clone().multiplyScalar(this.data.distance)
      );
      this.basePosition.y = this.data.height;
      
      // Move toward target position with smooth acceleration and deceleration
      const progress = Math.min(this.repositionTimer * 2, 1);
      const easeProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
      
      // Apply more aggressive movement when repositioning
      this.el.object3D.position.lerp(this.basePosition, easeProgress * 0.2 + this.data.followSpeed);
      
      // Once we've reached the target position, end repositioning mode
      if (progress >= 1 && cameraPosition.distanceTo(eyePosition) <= this.data.distance * 1.1) {
        this.isRepositioning = false;
      }
    }
    else {
      // In normal mode, gently follow the player's position but stay in front
      this.basePosition.copy(cameraPosition).add(
        cameraDirection.clone().multiplyScalar(this.data.distance)
      );
      this.basePosition.y = this.data.height;
      
      // Apply gentler movement when already in view
      this.el.object3D.position.lerp(this.basePosition, this.data.followSpeed * 0.5);
    }
    
    // Apply floating offset if the eye-float component is active
    if (this.el.floatOffset) {
      // Add the floating offset to the position
      this.el.object3D.position.add(this.el.floatOffset);
    }
    
    // Always look at the player, but preserve any Z rotation from float effect
    const currentZRotation = this.el.object3D.rotation.z;
    this.el.object3D.lookAt(cameraPosition);
    this.el.object3D.rotation.z = currentZRotation; // Restore the Z rotation after lookAt
  }
});