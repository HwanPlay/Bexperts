from rest_framework import serializers
from .models import Post

# ModelSerializer 뒤에서 설명합니다.
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('isTrue',)
    def create(self, validated_data):
        # print(request)
        print(self)
        print('--------')
        print(self.context)
        print('--------')
        print(self.data)
        # print(self.format)
        # print(self.view)
        print(self.data.get('title'))
        print('--------')
        print(validated_data)
        print('--------')
        print(dict(self.data))
        
        # images_data = self.context['request'].FILES
        # print(images_data)
        # print('--------')
        # print(self.data)
        # print('--------')
        # print('title: ', self.data.get('title'))
        # print('--------')
        # print(**validated_data)
        

        # print(images_data)
        post = Post.objects.create(**validated_data)
        
        # post = Post.objects.create(title=, image=images_data.get('image'))

        # print(images_data.get('image'))
        # for image_data in images_data.getlist('image'):
            # PostImage.objects.create(post=post, image=image_data)
        # PostImage.objects.create(post=post, image=images_data.get('image'))

        return post


        # instance.image = validated_data.get('image', instance.image)
        # print(instance.image)
        # return Post.objects.create(**validated_data)

    # def update(self, instance, validated_data):