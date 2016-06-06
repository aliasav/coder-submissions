from django.shortcuts import render

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from django.template import RequestContext
from django.http import JsonResponse


from api.models import Submission, Language

import logging
import json

logger = logging.getLogger(__name__)

# renders landing page
def render_landing_page(request, template="templates/dashboard/home.html"):
	"""
	Renders landing page
	"""
	logger.debug("Landing page rendered!")
	return render(request, template, context_instance=RequestContext(request))


class SubmissionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Submission

class SubmissionView(generics.ListAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    pagination_class = PageNumberPagination

    # statistical analysis api
    def stats(self, request):
    	response = {}
    	languages = Language.objects.all()
    	count = 0
    	language_submissions_count = {}; top_5_submissions = [];
    	for l in languages:
    		count = Submission.objects.filter(language=l.language).count()
    		language_submissions_count[l.language] = count

    	# fetch top 5 language submissions
    	i = 0
    	for k,v in sorted(language_submissions_count.iteritems(), key=lambda (k,v): (v,k), reverse=True):
    		top_5_submissions.append({"language":k, "submissions":v})
    		i +=1
    		if i>5:
    			break

    	response["top_5_submissions"] = top_5_submissions


    	# top 2 attempted
    	top_2_attempts = {
    		"first": {
    			"attempts": 0,
    			"question" : "",
    		},
    		"second": {
    			"attempts" : 0,
    			"question": "",
    		},
    	}
    	
    	total_submissions = 0
    	submissions_per_level = {
    		"easy": 0,
    		"medium": 0,
    		"hard": 0,
    	}

    	submissions = Submission.objects.all()
    	for sub in submissions:

    		metadata = json.loads(sub.metadata)
    		attempts = metadata["users_attempted"]

    		# update total submissions
    		total_submissions += metadata["users_attempted"]

    		# update submissions per levels
    		submissions_per_level[metadata["level"].lower()] += 1

    		if (attempts > top_2_attempts["first"]["attempts"]):
    			if not (top_2_attempts["second"]["question"] == top_2_attempts["first"]["question"]):
	    			top_2_attempts["second"]["attempts"] = top_2_attempts["first"]["attempts"]
	    			top_2_attempts["second"]["question"] = top_2_attempts["first"]["question"]
	    		if not (top_2_attempts["first"]["question"] == sub.title):
	    			top_2_attempts["first"]["attempts"] = attempts
	    			top_2_attempts["first"]["question"] = sub.title    			

    		elif (attempts > top_2_attempts["second"]["attempts"]):
    			if not (top_2_attempts["second"]["question"] == sub.title):
	    			top_2_attempts["second"]["attempts"] = attempts
	    			top_2_attempts["second"]["question"] = sub.title


    	response["top_2_attempts"] = top_2_attempts
    	response["total_submissions"] = total_submissions
    	response["submissions_per_level"] = submissions_per_level


    	return JsonResponse(response, status=200, safe=False)



