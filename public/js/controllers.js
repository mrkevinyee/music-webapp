rhythmiq.controller('userController', ['$scope', '$sce', '$location', 'userModel', 'songModel', function($scope, $sce, $location, userModel, songModel){ 

    // console.log($scope.loggedin_username);

    if(userModel.getAuthStatus()) {
        $scope.username  = userModel.getUserObject()['username'];
    }
    
    
    if($location.$$path == '/profile'){
        songModel.getUserSongs().then(function(response){
            $scope.userSongs = null;
            $scope.userSongs = response.data;
            console.log($scope.userSongs);
        }).catch(function(response) {
        });
    }

    if($location.$$path == '/home'){
        songModel.getNewSongs().then(function(response){
            $scope.userSongs = null;
            $scope.userSongs = response.data;
            console.log($scope.userSongs);
        }).catch(function(response) {
        });
    }

    //populate cities select
    if($location.$$path == '/register') {
        userModel.getCityList().then(function(response){
            $scope.data = {
                cities: response.data,
            };
            $scope.selectedCity = $scope.data.cities[0];
        }).catch(function(response) {
        });
    }

    angular.extend($scope, {
        // login: {
        //     email_address: 'kkevinyee13@gmail.com',
        //     password: 'Jesuszone#123'
        // },

        // register: {
        //     email_address: 'kevin.yee19@gmail.com',
        //     username: 'kevin.yee',
        //     password: 'Jesuszone#123',
        //     confirm_password: 'Jesuszone#123',
        // },

    });

    angular.extend($scope, {
        doLogin: function(loginForm) {
            var user = {
                email_address: $scope.login.email_address,
                password: $scope.login.password
            };
            userModel.doLogin(user).then(function(){
                $location.path('/home');
            }).catch(function(response) {
                alert('Incorrect email or password!');
            });
        },

        doRegister: function(registerForm) {
            var user = {
                email_address: $scope.register.email_address,
                username: $scope.register.username,
                password: $scope.register.password,
                confirm_password: $scope.register.confirm_password,
                date_of_birth: $scope.register.date_of_birth,
                city_id: $scope.selectedCity.city_id,
            };

            userModel.doRegister(user).then(function(){
                var user = {
                    email_address: $scope.register.email_address,
                    password: $scope.register.password
                };
                alert('Registration Successful! Click okay to login.');
                $location.path('/login');
                // userModel.doLogin(user).then(function(){
                //     $location.path('/home');
                // }).catch(function(response) {
                // });

            }).catch(function(response) {
                var error = '';
                angular.forEach(response.data, function(value, key) {
                   error = error + value + '<br>';
                });
                $scope.register.error = error;
                $scope.showerror = true;
            });
        },

        playSong: function(userSong) {
            // myPlaylist.pause();
            // myPlaylist.remove();
            var index = -1;
            for(var i in $scope.userSongs) {

                var item = $scope.userSongs[i];   
                if(userSong.song_title == item.song_title) {
                    index = i;
                }
                myPlaylist.add({ 
                    title : item.song_title,
                    artist  : item.username,
                    mp3 : "https://s3-ap-southeast-2.amazonaws.com/rhythmiq/" + item.song_file_name
                });
            }
            console.log(myPlaylist);
            console.log('song index is ' + index);
            myPlaylist.play(parseInt(index));
            
        },

        deleteSong: function(userSong) {
            var r = confirm("Are you sure you want to remove this song?");
            if (r == true) {
            songModel.deleteSong(userSong['song_id']).then(function(){
                var index = $scope.userSongs.indexOf(userSong);
                $scope.userSongs.splice(index, 1);  
            }).catch(function(response) {
                console.log(response.data);
            });
            } 
        },



    });
}]);
rhythmiq.controller('songController', ['$scope', '$sce', '$location', 'Upload', 'songModel', 'userModel', function($scope, $sce, $location, Upload, songModel, userModel){ 

    if(userModel.getAuthStatus()) {
        $scope.username  = userModel.getUserObject()['username'];
    }

    //populate genres
    if($location.$$path == '/upload') {
        songModel.getGenreList().then(function(response){
            $scope.data = {
                genres: response.data,
            };
            $scope.selectedGenre = $scope.data.genres[0];
        }).catch(function(response) {
        });
    }

    angular.extend($scope, {
    doSongUpload: function(uploadForm) {
            Upload.upload({
                url: baseUrl + '/api/v1/songs',
                method: 'POST',
                file: $scope.song_file,
                data: {
                    'song_title': $scope.upload_song_title,
                    'gnre_id': $scope.selectedGenre.gnre_id,
                }
            }).then(function(response){
                console.log(response.data);
                $scope.song_file = null;                
                $scope.upload_song_title = null;             
                $scope.upload_success = 'Song has been successfully uploaded! Go to your profile to listen.'
                $scope.showsuccess = true;
                $scope.showerror = false;
            }).catch(function(response) {
                console.log(response.data)
                var error = '';
                angular.forEach(response.data, function(value, key) {
                   error = error + value + '<br>';
                });
                $scope.upload_error = error;
                $scope.showerror = true;
            });
        },

    });

}]);
//# sourceMappingURL=controllers.js.map
