<!-- merchant details -->
<?php

$merchantSiteUrl = '';
$mrcindirizzo = "";
$mrccap = "";
$mrccomune = "";
$mrcstate = "";

if (empty($merchant->AddressData)){
	$mrcindirizzo = isset($merchant->Address)?$merchant->Address:""; 
	$mrccap = isset($merchant->ZipCode)?$merchant->ZipCode:""; 
	$mrccomune = isset($merchant->CityName)?$merchant->CityName:""; 
	$mrcstate = isset($merchant->StateName)?$merchant->StateName:""; 
	$merchantSiteUrl = isset($merchant->SiteUrl)?$merchant->SiteUrl:""; 
}else{
	$addressData = isset($merchant->AddressData)?$merchant->AddressData:"";
	$mrcindirizzo = isset($addressData->Address)?$addressData->Address:""; 
	$mrccap = isset($addressData->ZipCode)?$addressData->ZipCode:""; 
	$mrccomune = isset($addressData->CityName)?$addressData->CityName:""; 
	$mrcstate = isset($addressData->StateName)?$addressData->StateName:"";
	$merchantSiteUrl = isset($addressData->SiteUrl)?$addressData->SiteUrl:""; 
}
//	if (!empty($merchantSiteUrl)) {
//		$parsed = parse_url($merchantSiteUrl);
//		if (empty($parsed['scheme'])) {
//			$merchantSiteUrl = 'http://' . ltrim($merchantSiteUrl, '/');
//		}
//	}


$uriMerchant = $routeMerchant;
$route = $routeMerchant;

$uriMerchantResources = $uriMerchant .'/'._x( 'resources', 'Page slug', 'bfi' ).'?limitstart=0';
$uriMerchantOffers = $uriMerchant .'/'._x('offers', 'Page slug', 'bfi' ).'?limitstart=0';
$uriMerchantOnsellunits = $uriMerchant .'/'._x( 'onsellunits', 'Page slug', 'bfi' ).'?limitstart=0';
$uriMerchantRatings = $uriMerchant .'/'._x('reviews', 'Page slug', 'bfi' );
$uriMerchantRedirect = $uriMerchant .'/'._x('redirect', 'Page slug', 'bfi' );
$uriMerchantInfoRequest = $uriMerchant .'/'._x('contactspopup', 'Page slug', 'bfi' );

$merchantLogo = BFI()->plugin_url() . "/assets/images/defaults/default-s3.jpeg";
if (!empty($merchant->LogoUrl)){
	$merchantLogo = BFCHelper::getImageUrlResized('merchant',$merchant->LogoUrl, 'logobig');
}
if(BFI()->isResourcePage() && !empty($resource_id)){
	$uriMerchantInfoRequest .= '/'.$resource_id .'-'._x( 'accommodation-details', 'Page slug', 'bfi' );
}
if(BFI()->isResourceOnSellPage()){
	$uriMerchantInfoRequest .= '/'.$resource_id .'-'._x( 'properties-for-sale', 'Page slug', 'bfi' );
}

?>
<div class=" bfi-hideonextra">
	<br />
	<div class=" bfi-border">
		<div class="bfi-row bfi-merchant-simple bfi-hideonextra">
			<div class="bfi-col-md-4">
					<div class="bfi-vcard-name">
						<a <?php if($isportal) { ?> href="<?php echo $route?>"<?php } ?>><?php echo  $merchant->Name?></a>
						<span class="bfi-vcard-star-rating">
						<?php for($i = 0; $i < $merchant->Rating ; $i++) { ?>
						  <i class="fa fa-star"></i>
						<?php } ?>
						</span>
					</div>
					<div class="bfi-row ">
						<div class="bfi-col-md-5 ">
							<div class="bfi-vcard-logo"><a <?php if($isportal) { ?> href="<?php echo $route?>"<?php } ?>><img src="<?php echo $merchantLogo?>" /></a></div>	
						</div>
						<div class="bfi-col-md-7 bfi-pad0-10">
							
							<span class="street-address"><?php echo $mrcindirizzo ?></span>, <span class="postal-code "><?php echo $mrccap ?></span> <span class="locality"><?php echo $mrccomune ?></span> <span class="state">, <?php echo $mrcstate ?></span><br />
							<div class="bfi-height10"></div>
							<?php if($isportal) { ?>
							<div class="bfi-text-center">
								<span class="tel "><a  href="javascript:void(0);" onclick="bookingfor.getData(urlCheck,'merchantid=<?php echo $merchant->MerchantId?>&task=GetPhoneByMerchantId&language=' + cultureCode,this,'<?php echo  addslashes($merchant->Name) ?>','PhoneView')"  id="phone<?php echo $merchant->MerchantId?>" class="bfi-smallbtn"><?php _e('Show phone', 'bfi'); ?></a></span>
								<?php if ($merchantSiteUrl != ''):?><span class="website"><a target="_blank" href="<?php echo $uriMerchantRedirect; ?>" class="bfi-smallbtn"><?php _e('Web site', 'bfi'); ?></a></span>
								<?php endif;?>
							</div>
							<?php } ?>
						</div>
					</div>			
					<div class="bfi-height10"></div>
					<div class="bfi-text-center">
							<a class="boxedpopup bfi-btn bfi-btn-blue" href="<?php echo $uriMerchantInfoRequest?>" style="width: 100%;"><?php echo  _e('Request info' , 'bfi') ?></a>
					</div>
			</div>	
			<div class="bfi-col-md-8 bfi-pad10">
				<ul class="bfi-menu-small">
				<?php if($isportal) { ?>
					<?php if ($merchant->HasResources):?>
						<li><a href="<?php echo $uriMerchantResources; ?>"><?php _e('Proposals', 'bfi'); ?></a></li>
					<?php endif ?>
					<?php if ($merchant->HasOnSellUnits):?>
						<li><a href="<?php echo $uriMerchantOnsellunits; ?>"><?php _e('Real Estate', 'bfi'); ?></a></li>
					<?php endif ?>	
					<?php if ($merchant->HasResources):?>
						<?php if ($merchant->HasOffers || true):?>
							<li><a href="<?php echo $uriMerchantOffers; ?>"><?php _e('Offers', 'bfi'); ?></a></li>
						<?php endif ?>
					<?php endif;?>
					<?php if ($merchant->RatingsContext !== 0) :?>
						<li><a href="<?php echo $uriMerchantRatings; ?>"><?php _e('Reviews', 'bfi'); ?></a></li>
					<?php endif ?>	
				<?php } ?>
				</ul>
				<?php 
				if($merchant->AcceptanceCheckIn != "-" && $merchant->AcceptanceCheckOut != "-" && !empty($merchant->OtherDetails) ){
				?>
					<div><?php _e('Good to know', 'bfi') ?></div>
					<div class="bfi-pad10-0 ">   
						<?php if($merchant->AcceptanceCheckIn != "-"){ ?> <?php _e('Check-in', 'bfi') ?> <?php echo $merchant->AcceptanceCheckIn ?>
						<?php } ?>
						<?php if($merchant->AcceptanceCheckOut != "-"){ ?>
						<?php _e('Check-out', 'bfi') ?> <?php echo $merchant->AcceptanceCheckOut ?>
						<?php } ?>
					</div>
					<?php if(!empty($merchant->OtherDetails) ){ ?>
						<div class="applyshorten"><?php echo BFCHelper::getLanguage($merchant->OtherDetails, $language, null, array('ln2br'=>'ln2br', 'striptags'=>'striptags'))  ?></div>
					<?php } ?>					
				<?php 
				}
				?>


			</div>	
		</div>	
	</div>
</div>
