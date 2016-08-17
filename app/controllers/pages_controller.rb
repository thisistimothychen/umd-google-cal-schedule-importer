class PagesController < ApplicationController
  def index
    #http.verify_mode = OpenSSL::SSL::VERIFY_PEER
    render :nothing => true, :status => :unauthorized
  end
end
