exports.stack = function(t){

	t.module("service/episodeServiceTest");

	t.asyncTest('save episode', function() {
		
		var service = require('../../server/EpisodeService.js');
		var episode = {
			id: 1,
			sentences:[{
				character:'Calvin',
				sentence:'Hello Hobbes'
			},{
				character:'Hobber',
				sentence:'Hello Calvin'
			}]
		};


		service.saveTranscription(episode).done(function(){
			t.equal(1, 1);
			t.start();
		});

	});

}
