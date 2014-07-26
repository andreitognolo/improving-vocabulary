asyncTest('one should equal one', function() {
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
		console.log(arguments);
		QUnit.start();
	});

});	
